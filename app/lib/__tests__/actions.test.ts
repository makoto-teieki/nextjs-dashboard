/**
 * Integration tests for Server Actions
 * Note: These tests mock database and Next.js functions
 */

// Mock Next.js modules BEFORE importing actions
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('NEXT_REDIRECT'); // Next.js redirect throws an error
  }),
}));

// Mock postgres - the mock file will be automatically used
jest.mock('postgres');

// Mock auth - the mock file will be automatically used via moduleNameMapper
jest.mock('@/auth', () => ({
  signIn: jest.fn(),
}));

// Import mocked modules
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';

// Get the mock SQL function
const mockSql = postgres() as jest.MockedFunction<any>;

// Now import the actions to test
import { createInvoice, updateInvoice, deleteInvoice, type State } from '../actions';

describe('Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createInvoice', () => {
    it('should create invoice with valid data', async () => {
      const formData = new FormData();
      formData.append('customerId', 'customer-123');
      formData.append('amount', '100');
      formData.append('status', 'pending');

      mockSql.mockResolvedValueOnce([]); // Mock successful insert

      const prevState: State = {};

      await expect(createInvoice(prevState, formData)).rejects.toThrow('NEXT_REDIRECT');

      // Verify SQL was called with correct data
      expect(mockSql).toHaveBeenCalledTimes(1);
      // SQL template literal is called with an array of strings
      expect(mockSql.mock.calls[0][0].join('')).toContain('INSERT INTO invoices');

      // Verify revalidatePath was called
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/invoices');

      // Verify redirect was called
      expect(redirect).toHaveBeenCalledWith('/dashboard/invoices');
    });

    it('should return validation errors for invalid data', async () => {
      const formData = new FormData();
      formData.append('customerId', '');
      formData.append('amount', '0');
      formData.append('status', 'invalid');

      const prevState: State = {};

      const result = await createInvoice(prevState, formData);

      expect(result.errors).toBeDefined();
      expect(result.message).toBe('Missing Fields. Failed to Create Invoice.');
      expect(mockSql).not.toHaveBeenCalled();
    });

    it('should return error on database failure', async () => {
      const formData = new FormData();
      formData.append('customerId', 'customer-123');
      formData.append('amount', '100');
      formData.append('status', 'pending');

      mockSql.mockRejectedValueOnce(new Error('DB Error'));

      const prevState: State = {};

      const result = await createInvoice(prevState, formData);

      expect(result.message).toBe('Database Error: Failed to Create Invoice.');
      expect(redirect).not.toHaveBeenCalled();
    });

    it('should convert amount to cents', async () => {
      const formData = new FormData();
      formData.append('customerId', 'customer-123');
      formData.append('amount', '99.99');
      formData.append('status', 'paid');

      mockSql.mockResolvedValueOnce([]);

      const prevState: State = {};

      await expect(createInvoice(prevState, formData)).rejects.toThrow('NEXT_REDIRECT');

      // Check that amount was converted to cents (9999)
      const sqlCall = mockSql.mock.calls[0];
      // Arguments after the template array: customerId, amountInCents, status, date
      const amountArg = sqlCall[2]; // Third argument should be amount in cents
      expect(amountArg).toBe(9999);
    });
  });

  describe('updateInvoice', () => {
    it('should update invoice with valid data', async () => {
      const id = 'invoice-456';
      const formData = new FormData();
      formData.append('customerId', 'customer-789');
      formData.append('amount', '200');
      formData.append('status', 'paid');

      mockSql.mockResolvedValueOnce([]); // Mock successful update

      const prevState: State = {};

      await expect(updateInvoice(id, prevState, formData)).rejects.toThrow('NEXT_REDIRECT');

      expect(mockSql).toHaveBeenCalledTimes(1);
      expect(mockSql.mock.calls[0][0].join('')).toContain('UPDATE invoices');
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/invoices');
      expect(redirect).toHaveBeenCalledWith('/dashboard/invoices');
    });

    it('should return validation errors for invalid data', async () => {
      const id = 'invoice-456';
      const formData = new FormData();
      formData.append('customerId', '');
      formData.append('amount', '-10');
      formData.append('status', 'pending');

      const prevState: State = {};

      const result = await updateInvoice(id, prevState, formData);

      expect(result.errors).toBeDefined();
      expect(result.message).toBe('Missing Fields. Failed to Update Invoice.');
      expect(mockSql).not.toHaveBeenCalled();
    });

    it('should return error on database failure', async () => {
      const id = 'invoice-456';
      const formData = new FormData();
      formData.append('customerId', 'customer-123');
      formData.append('amount', '100');
      formData.append('status', 'pending');

      mockSql.mockRejectedValueOnce(new Error('DB Error'));

      const prevState: State = {};

      const result = await updateInvoice(id, prevState, formData);

      expect(result.message).toBe('Database Error: Failed to Update Invoice.');
      expect(redirect).not.toHaveBeenCalled();
    });

    it('should include invoice id in SQL query', async () => {
      const id = 'invoice-999';
      const formData = new FormData();
      formData.append('customerId', 'customer-123');
      formData.append('amount', '100');
      formData.append('status', 'pending');

      mockSql.mockResolvedValueOnce([]);

      const prevState: State = {};

      await expect(updateInvoice(id, prevState, formData)).rejects.toThrow('NEXT_REDIRECT');

      // Verify the id was passed to SQL
      const sqlCall = mockSql.mock.calls[0];
      expect(sqlCall[0].join('')).toContain('WHERE id =');
      // Arguments: customerId, amountInCents, status, id
      expect(sqlCall[4]).toBe(id);
    });
  });

  describe('deleteInvoice', () => {
    it('should delete invoice successfully', async () => {
      const id = 'invoice-to-delete';
      mockSql.mockResolvedValueOnce([]);

      await deleteInvoice(id);

      expect(mockSql).toHaveBeenCalledTimes(1);
      expect(mockSql.mock.calls[0][0].join('')).toContain('DELETE FROM invoices');
      expect(mockSql.mock.calls[0][0].join('')).toContain('WHERE id =');
      expect(mockSql.mock.calls[0][1]).toBe(id);
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/invoices');
    });

    it('should throw error on database failure', async () => {
      const id = 'invoice-to-delete';
      mockSql.mockRejectedValueOnce(new Error('DB Error'));

      await expect(deleteInvoice(id)).rejects.toThrow(
        'Database Error: Failed to delete invoice.',
      );
    });
  });
});

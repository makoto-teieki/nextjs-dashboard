/**
 * Tests for Server Actions validation logic using Zod schemas
 */
import { z } from 'zod';

// Re-create the schemas from actions.ts for testing
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

describe('Invoice Zod Validation', () => {
  describe('CreateInvoice schema', () => {
    it('should validate valid invoice data', () => {
      const validData = {
        customerId: 'customer-123',
        amount: 100,
        status: 'pending' as const,
      };

      const result = CreateInvoice.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should coerce string amount to number', () => {
      const data = {
        customerId: 'customer-123',
        amount: '100',
        status: 'pending' as const,
      };

      const result = CreateInvoice.safeParse(data);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.amount).toBe(100);
        expect(typeof result.data.amount).toBe('number');
      }
    });

    it('should reject missing customerId', () => {
      const data = {
        amount: 100,
        status: 'pending' as const,
      };

      const result = CreateInvoice.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.customerId).toBeDefined();
      }
    });

    it('should reject amount less than or equal to zero', () => {
      const dataZero = {
        customerId: 'customer-123',
        amount: 0,
        status: 'pending' as const,
      };

      const resultZero = CreateInvoice.safeParse(dataZero);
      expect(resultZero.success).toBe(false);
      if (!resultZero.success) {
        expect(resultZero.error.flatten().fieldErrors.amount).toContain(
          'Please enter an amount greater than $0.',
        );
      }

      const dataNegative = {
        customerId: 'customer-123',
        amount: -10,
        status: 'pending' as const,
      };

      const resultNegative = CreateInvoice.safeParse(dataNegative);
      expect(resultNegative.success).toBe(false);
    });

    it('should reject invalid status', () => {
      const data = {
        customerId: 'customer-123',
        amount: 100,
        status: 'invalid-status',
      };

      const result = CreateInvoice.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.status).toBeDefined();
      }
    });

    it('should accept both pending and paid status', () => {
      const pendingData = {
        customerId: 'customer-123',
        amount: 100,
        status: 'pending' as const,
      };

      const paidData = {
        customerId: 'customer-123',
        amount: 100,
        status: 'paid' as const,
      };

      expect(CreateInvoice.safeParse(pendingData).success).toBe(true);
      expect(CreateInvoice.safeParse(paidData).success).toBe(true);
    });

    it('should reject non-numeric amount', () => {
      const data = {
        customerId: 'customer-123',
        amount: 'not-a-number',
        status: 'pending' as const,
      };

      const result = CreateInvoice.safeParse(data);

      expect(result.success).toBe(false);
    });

    it('should handle multiple validation errors', () => {
      const data = {
        // missing customerId
        amount: -5, // invalid amount
        status: 'invalid', // invalid status
      };

      const result = CreateInvoice.safeParse(data);

      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.customerId).toBeDefined();
        expect(errors.amount).toBeDefined();
        expect(errors.status).toBeDefined();
      }
    });
  });

  describe('UpdateInvoice schema', () => {
    it('should validate valid update data', () => {
      const validData = {
        customerId: 'customer-456',
        amount: 250.5,
        status: 'paid' as const,
      };

      const result = UpdateInvoice.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should have the same validation rules as CreateInvoice', () => {
      const invalidData = {
        customerId: 'customer-123',
        amount: 0,
        status: 'invalid',
      };

      const createResult = CreateInvoice.safeParse(invalidData);
      const updateResult = UpdateInvoice.safeParse(invalidData);

      expect(createResult.success).toBe(updateResult.success);
      expect(createResult.success).toBe(false);
    });
  });

  describe('FormData simulation', () => {
    it('should validate data from FormData-like object', () => {
      // Simulate FormData.get() return values (always strings or null)
      const formDataValues = {
        customerId: 'customer-789',
        amount: '99.99', // FormData returns strings
        status: 'pending',
      };

      const result = CreateInvoice.safeParse(formDataValues);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.amount).toBe(99.99);
        expect(typeof result.data.amount).toBe('number');
      }
    });

    it('should handle empty string values from FormData', () => {
      const formDataValues = {
        customerId: '',
        amount: '',
        status: '',
      };

      const result = CreateInvoice.safeParse(formDataValues);

      expect(result.success).toBe(false);
    });
  });
});

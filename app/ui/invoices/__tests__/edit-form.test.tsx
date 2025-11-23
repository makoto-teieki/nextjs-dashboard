/**
 * Tests for Invoice Edit Form component
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditInvoiceForm from '../edit-form';
import { CustomerField, InvoiceForm } from '@/app/lib/definitions';

// Mock the actions module
jest.mock('@/app/lib/actions', () => ({
  updateInvoice: jest.fn(),
  State: {},
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock Button component
jest.mock('@/app/ui/button', () => ({
  Button: ({ children, type }: { children: React.ReactNode; type?: string }) => {
    return <button type={type as any}>{children}</button>;
  },
}));

// Mock Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  CheckIcon: () => <span data-testid="check-icon" />,
  ClockIcon: () => <span data-testid="clock-icon" />,
  CurrencyDollarIcon: () => <span data-testid="currency-icon" />,
  UserCircleIcon: () => <span data-testid="user-icon" />,
}));

describe('Invoice Edit Form', () => {
  const mockCustomers: CustomerField[] = [
    { id: 'customer-1', name: 'Alice Johnson' },
    { id: 'customer-2', name: 'Bob Smith' },
    { id: 'customer-3', name: 'Charlie Brown' },
  ];

  const mockInvoice: InvoiceForm = {
    id: 'invoice-123',
    customer_id: 'customer-2',
    amount: 250,
    status: 'pending',
  };

  it('should render the form with all fields', () => {
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Check for labels
    expect(screen.getByText('Choose customer')).toBeInTheDocument();
    expect(screen.getByText('Choose an amount')).toBeInTheDocument();
    expect(screen.getByText('Set the invoice status')).toBeInTheDocument();

    // Check for form fields
    expect(screen.getByLabelText('Choose customer')).toBeInTheDocument();
    expect(screen.getByLabelText('Choose an amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Pending')).toBeInTheDocument();
    expect(screen.getByLabelText('Paid')).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByRole('button', { name: 'Edit Invoice' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should populate form with existing invoice data', () => {
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    const customerSelect = screen.getByLabelText('Choose customer') as HTMLSelectElement;
    const amountInput = screen.getByLabelText('Choose an amount') as HTMLInputElement;
    const pendingRadio = screen.getByLabelText('Pending') as HTMLInputElement;
    const paidRadio = screen.getByLabelText('Paid') as HTMLInputElement;

    // Check that fields are populated with invoice data
    expect(customerSelect.value).toBe('customer-2');
    expect(amountInput.value).toBe('250');
    expect(pendingRadio.checked).toBe(true);
    expect(paidRadio.checked).toBe(false);
  });

  it('should populate form with paid status correctly', () => {
    const paidInvoice: InvoiceForm = {
      ...mockInvoice,
      status: 'paid',
    };

    render(<EditInvoiceForm invoice={paidInvoice} customers={mockCustomers} />);

    const pendingRadio = screen.getByLabelText('Pending') as HTMLInputElement;
    const paidRadio = screen.getByLabelText('Paid') as HTMLInputElement;

    expect(pendingRadio.checked).toBe(false);
    expect(paidRadio.checked).toBe(true);
  });

  it('should allow user to change customer', async () => {
    const user = userEvent.setup();
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    const customerSelect = screen.getByLabelText('Choose customer') as HTMLSelectElement;

    // Initial value
    expect(customerSelect.value).toBe('customer-2');

    // Change to different customer
    await user.selectOptions(customerSelect, 'customer-3');

    expect(customerSelect.value).toBe('customer-3');
  });

  it('should allow user to change amount', async () => {
    const user = userEvent.setup();
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    const amountInput = screen.getByLabelText('Choose an amount') as HTMLInputElement;

    // Clear and type new amount
    await user.clear(amountInput);
    await user.type(amountInput, '500');

    expect(amountInput.value).toBe('500');
  });

  it('should allow user to change status', async () => {
    const user = userEvent.setup();
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    const pendingRadio = screen.getByLabelText('Pending') as HTMLInputElement;
    const paidRadio = screen.getByLabelText('Paid') as HTMLInputElement;

    // Initial status is pending
    expect(pendingRadio.checked).toBe(true);
    expect(paidRadio.checked).toBe(false);

    // Change to paid
    await user.click(paidRadio);

    expect(pendingRadio.checked).toBe(false);
    expect(paidRadio.checked).toBe(true);
  });

  it('should have correct input attributes', () => {
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    const customerSelect = screen.getByLabelText('Choose customer');
    const amountInput = screen.getByLabelText('Choose an amount');
    const pendingRadio = screen.getByLabelText('Pending');
    const paidRadio = screen.getByLabelText('Paid');

    // Check names for form submission
    expect(customerSelect).toHaveAttribute('name', 'customerId');
    expect(amountInput).toHaveAttribute('name', 'amount');
    expect(pendingRadio).toHaveAttribute('name', 'status');
    expect(paidRadio).toHaveAttribute('name', 'status');

    // Check amount input type
    expect(amountInput).toHaveAttribute('type', 'number');
    expect(amountInput).toHaveAttribute('step', '0.01');

    // Check radio values
    expect(pendingRadio).toHaveAttribute('value', 'pending');
    expect(paidRadio).toHaveAttribute('value', 'paid');
  });

  it('should have accessibility attributes', () => {
    const { container } = render(
      <EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />,
    );

    const customerSelect = screen.getByLabelText('Choose customer');
    const amountInput = screen.getByLabelText('Choose an amount');
    const statusRadios = screen.getAllByRole('radio');

    // Check aria-describedby for error messages
    expect(customerSelect).toHaveAttribute('aria-describedby', 'customer-error');
    expect(amountInput).toHaveAttribute('aria-describedby', 'amount-error');
    statusRadios.forEach((radio) => {
      expect(radio).toHaveAttribute('aria-describedby', 'status-error');
    });

    // Check for aria-live regions
    const customerError = container.querySelector('#customer-error');
    const amountError = container.querySelector('#amount-error');
    const statusError = container.querySelector('#status-error');

    expect(customerError).toHaveAttribute('aria-live', 'polite');
    expect(customerError).toHaveAttribute('aria-atomic', 'true');

    expect(amountError).toHaveAttribute('aria-live', 'polite');
    expect(amountError).toHaveAttribute('aria-atomic', 'true');

    expect(statusError).toHaveAttribute('aria-live', 'polite');
    expect(statusError).toHaveAttribute('aria-atomic', 'true');
  });

  it('should render customer options', () => {
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    const customerSelect = screen.getByLabelText('Choose customer') as HTMLSelectElement;

    // Check default option
    expect(screen.getByText('Select a customer')).toBeInTheDocument();

    // Check all customer options are rendered
    mockCustomers.forEach((customer) => {
      expect(screen.getByText(customer.name)).toBeInTheDocument();
    });

    // Verify options have correct values
    const options = Array.from(customerSelect.options);
    expect(options).toHaveLength(mockCustomers.length + 1); // +1 for default option
  });

  it('should render with different invoice amounts', () => {
    const invoiceWithDecimals: InvoiceForm = {
      ...mockInvoice,
      amount: 99.99,
    };

    render(<EditInvoiceForm invoice={invoiceWithDecimals} customers={mockCustomers} />);

    const amountInput = screen.getByLabelText('Choose an amount') as HTMLInputElement;

    expect(amountInput.value).toBe('99.99');
  });

  it('should handle zero amount', () => {
    const invoiceWithZero: InvoiceForm = {
      ...mockInvoice,
      amount: 0,
    };

    render(<EditInvoiceForm invoice={invoiceWithZero} customers={mockCustomers} />);

    const amountInput = screen.getByLabelText('Choose an amount') as HTMLInputElement;

    expect(amountInput.value).toBe('0');
  });

  it('should have Cancel link pointing to invoices page', () => {
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    const cancelLink = screen.getByRole('link', { name: 'Cancel' });

    expect(cancelLink).toHaveAttribute('href', '/dashboard/invoices');
  });

  it('should render with empty customer list', () => {
    render(<EditInvoiceForm invoice={mockInvoice} customers={[]} />);

    const customerSelect = screen.getByLabelText('Choose customer') as HTMLSelectElement;

    // Should have default option plus the current customer is still selected via defaultValue
    expect(customerSelect.options.length).toBeGreaterThan(0);
    expect(screen.getByText('Select a customer')).toBeInTheDocument();
  });
});

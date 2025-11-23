/**
 * Tests for Invoice Create Form component
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from '../create-form';
import { CustomerField } from '@/app/lib/definitions';

// Mock the actions module
jest.mock('@/app/lib/actions', () => ({
  createInvoice: jest.fn(),
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

describe('Invoice Create Form', () => {
  const mockCustomers: CustomerField[] = [
    { id: 'customer-1', name: 'Alice Johnson' },
    { id: 'customer-2', name: 'Bob Smith' },
    { id: 'customer-3', name: 'Charlie Brown' },
  ];

  it('should render the form with all fields', () => {
    render(<Form customers={mockCustomers} />);

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
    expect(screen.getByRole('button', { name: 'Create Invoice' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should render customer options', () => {
    render(<Form customers={mockCustomers} />);

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

  it('should allow user to select a customer', async () => {
    const user = userEvent.setup();
    render(<Form customers={mockCustomers} />);

    const customerSelect = screen.getByLabelText('Choose customer') as HTMLSelectElement;

    await user.selectOptions(customerSelect, 'customer-2');

    expect(customerSelect.value).toBe('customer-2');
  });

  it('should allow user to enter an amount', async () => {
    const user = userEvent.setup();
    render(<Form customers={mockCustomers} />);

    const amountInput = screen.getByLabelText('Choose an amount') as HTMLInputElement;

    await user.type(amountInput, '99.99');

    expect(amountInput.value).toBe('99.99');
  });

  it('should allow user to select invoice status', async () => {
    const user = userEvent.setup();
    render(<Form customers={mockCustomers} />);

    const pendingRadio = screen.getByLabelText('Pending') as HTMLInputElement;
    const paidRadio = screen.getByLabelText('Paid') as HTMLInputElement;

    // Select pending
    await user.click(pendingRadio);
    expect(pendingRadio.checked).toBe(true);
    expect(paidRadio.checked).toBe(false);

    // Select paid
    await user.click(paidRadio);
    expect(pendingRadio.checked).toBe(false);
    expect(paidRadio.checked).toBe(true);
  });

  it('should have correct input attributes', () => {
    render(<Form customers={mockCustomers} />);

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
    const { container } = render(<Form customers={mockCustomers} />);

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

  it('should render with empty customer list', () => {
    render(<Form customers={[]} />);

    const customerSelect = screen.getByLabelText('Choose customer') as HTMLSelectElement;

    // Should only have the default option
    expect(customerSelect.options).toHaveLength(1);
    expect(screen.getByText('Select a customer')).toBeInTheDocument();
  });
});

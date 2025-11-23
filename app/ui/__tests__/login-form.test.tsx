/**
 * Tests for Login Form component
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../login-form';

// Mock the actions module
jest.mock('@/app/lib/actions', () => ({
  authenticate: jest.fn(),
}));

// Mock Button component
jest.mock('../button', () => ({
  Button: ({
    children,
    className,
    'aria-disabled': ariaDisabled,
  }: {
    children: React.ReactNode;
    className?: string;
    'aria-disabled'?: boolean;
  }) => {
    return (
      <button className={className} aria-disabled={ariaDisabled} type="submit">
        {children}
      </button>
    );
  },
}));

// Mock fonts
jest.mock('@/app/ui/fonts', () => ({
  lusitana: { className: 'lusitana-font' },
}));

// Mock Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  AtSymbolIcon: () => <span data-testid="at-symbol-icon" />,
  KeyIcon: () => <span data-testid="key-icon" />,
  ExclamationCircleIcon: () => <span data-testid="exclamation-icon" />,
}));

jest.mock('@heroicons/react/20/solid', () => ({
  ArrowRightIcon: () => <span data-testid="arrow-right-icon" />,
}));

describe('Login Form', () => {
  it('should render the login form with all fields', () => {
    render(<LoginForm />);

    // Check for heading
    expect(screen.getByText('Please log in to continue.')).toBeInTheDocument();

    // Check for labels
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();

    // Check for submit button
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('should have correct input attributes', () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    // Check email input attributes
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('name', 'email');
    expect(emailInput).toHaveAttribute('placeholder', 'Enter your email address');
    expect(emailInput).toBeRequired();

    // Check password input attributes
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('name', 'password');
    expect(passwordInput).toHaveAttribute('placeholder', 'Enter password');
    expect(passwordInput).toBeRequired();
    expect(passwordInput).toHaveAttribute('minLength', '6');
  });

  it('should allow user to enter email and password', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput.value).toBe('user@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should render icons', () => {
    render(<LoginForm />);

    expect(screen.getByTestId('at-symbol-icon')).toBeInTheDocument();
    expect(screen.getByTestId('key-icon')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument();
  });

  it('should have accessibility attributes for error message container', () => {
    const { container } = render(<LoginForm />);

    // Find the error message container
    const errorContainer = container.querySelector('[aria-live="polite"]');

    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer).toHaveAttribute('aria-atomic', 'true');
  });

  it('should have correct form structure', () => {
    render(<LoginForm />);

    const form = screen.getByRole('button', { name: /log in/i }).closest('form');

    expect(form).toBeInTheDocument();
    expect(form).toHaveClass('space-y-3');
  });

  it('should render email input with correct id', () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('id', 'email');
  });

  it('should render password input with correct id', () => {
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('id', 'password');
  });

  it('should have heading with correct font class', () => {
    render(<LoginForm />);

    const heading = screen.getByText('Please log in to continue.');
    expect(heading).toHaveClass('lusitana-font');
    expect(heading.tagName).toBe('H1');
  });

  it('should validate email format with HTML5 validation', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;

    // Type invalid email
    await user.type(emailInput, 'invalid-email');

    // HTML5 validation will prevent form submission
    expect(emailInput.validity.typeMismatch).toBe(true);
  });

  it('should have minLength attribute on password input', () => {
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    // Check that minLength attribute is set
    expect(passwordInput).toHaveAttribute('minLength', '6');
    expect(passwordInput.minLength).toBe(6);
  });

  it('should accept valid password input', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    // Type password with valid length
    await user.type(passwordInput, '123456');

    expect(passwordInput.value).toBe('123456');
    expect(passwordInput.value.length).toBeGreaterThanOrEqual(6);
  });
});

import { test, expect } from '@playwright/test';

/**
 * Invoice CRUD E2E Tests
 * Tests the full invoice management workflow
 */

// Helper function to login before each test
async function login(page: any) {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill('user@nextmail.com');
  await page.getByLabel(/password/i).fill('123456');
  await page.getByRole('button', { name: /log in/i }).click();
  await page.waitForURL('/dashboard', { timeout: 15000 });
}

test.describe('Invoice Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display invoices page', async ({ page }) => {
    await page.goto('/dashboard/invoices');

    // Check for invoices page elements
    await expect(page.getByRole('heading', { name: /invoices/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /create invoice/i })).toBeVisible();

    // Check for search functionality
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });

  test('should search for invoices', async ({ page }) => {
    await page.goto('/dashboard/invoices');

    // Type in search box
    const searchBox = page.getByPlaceholder(/search/i);
    await searchBox.fill('Lee');

    // Wait for URL to update with search params
    await expect(page).toHaveURL(/query=Lee/);

    // Results should be filtered (this depends on seed data)
    // We're just checking that the search functionality works
    await expect(searchBox).toHaveValue('Lee');
  });

  test('should navigate to create invoice page', async ({ page }) => {
    await page.goto('/dashboard/invoices');

    // Click create invoice button
    await page.getByRole('link', { name: /create invoice/i }).click();

    // Should be on create page
    await expect(page).toHaveURL('/dashboard/invoices/create');

    // Check for form elements
    await expect(page.getByText(/choose customer/i)).toBeVisible();
    await expect(page.getByText(/choose an amount/i)).toBeVisible();
    await expect(page.getByText(/set the invoice status/i)).toBeVisible();
  });

  test('should create a new invoice', async ({ page }) => {
    await page.goto('/dashboard/invoices/create');

    // Fill out the form
    await page.getByLabel(/choose customer/i).selectOption({ index: 1 }); // Select first customer
    await page.getByLabel(/choose an amount/i).fill('500');
    await page.getByLabel(/pending/i).check();

    // Submit form
    await page.getByRole('button', { name: /create invoice/i }).click();

    // Should redirect to invoices page
    await expect(page).toHaveURL('/dashboard/invoices');

    // Success indication would be that we're back on the invoices page
    await expect(page.getByRole('heading', { name: /invoices/i })).toBeVisible();
  });

  test('should show validation errors when creating invoice with invalid data', async ({
    page,
  }) => {
    await page.goto('/dashboard/invoices/create');

    // Submit form without filling it
    await page.getByRole('button', { name: /create invoice/i }).click();

    // Should show validation errors
    await expect(page.getByText(/please select a customer/i)).toBeVisible();
    await expect(page.getByText(/please enter an amount greater than/i)).toBeVisible();
  });

  test('should navigate to edit invoice page', async ({ page }) => {
    await page.goto('/dashboard/invoices');

    // Find first edit button and click it
    const editButton = page.getByRole('link', { name: /edit/i }).first();
    await editButton.click();

    // Wait for navigation to edit page
    await page.waitForURL(/\/dashboard\/invoices\/.*\/edit/);

    // Should be on edit page (URL contains invoice ID)
    await expect(page.url()).toContain('/dashboard/invoices/');
    await expect(page.url()).toContain('/edit');

    // Check for form elements
    await expect(page.getByText(/choose customer/i)).toBeVisible();
    await expect(page.getByText(/choose an amount/i)).toBeVisible();

    // Form should be populated with existing data
    const amountInput = page.getByLabel(/choose an amount/i);
    await expect(amountInput).not.toHaveValue('');
  });

  test('should edit an existing invoice', async ({ page }) => {
    await page.goto('/dashboard/invoices');

    // Click first edit button
    await page.getByRole('link', { name: /edit/i }).first().click();

    // Update amount
    const amountInput = page.getByLabel(/choose an amount/i);
    await amountInput.clear();
    await amountInput.fill('999');

    // Change status to paid
    await page.getByLabel(/paid/i).check();

    // Submit form
    await page.getByRole('button', { name: /edit invoice/i }).click();

    // Should redirect to invoices page
    await expect(page).toHaveURL('/dashboard/invoices');
  });

  test('should cancel invoice creation', async ({ page }) => {
    await page.goto('/dashboard/invoices/create');

    // Fill some data
    await page.getByLabel(/choose an amount/i).fill('100');

    // Click cancel
    await page.getByRole('link', { name: /cancel/i }).click();

    // Should go back to invoices page
    await expect(page).toHaveURL('/dashboard/invoices');
  });

  test('should delete an invoice', async ({ page }) => {
    // First create an invoice to delete
    await page.goto('/dashboard/invoices/create');
    await page.getByLabel(/choose customer/i).selectOption({ index: 1 });
    await page.getByLabel(/choose an amount/i).fill('100');
    await page.getByLabel(/pending/i).check();
    await page.getByRole('button', { name: /create invoice/i }).click();
    await expect(page).toHaveURL('/dashboard/invoices');

    // Find the delete button for the invoice we just created
    // This is tricky because we need to find the right one
    // We'll just click the first delete button
    const deleteButton = page.getByRole('button', { name: /delete/i }).first();

    // Setup dialog handler to confirm deletion
    page.on('dialog', (dialog) => dialog.accept());

    // Click delete button
    await deleteButton.click();

    // Page should reload/update (invoice list refreshes)
    // We can verify we're still on the invoices page
    await expect(page).toHaveURL(/\/dashboard\/invoices/);
  });

  test('should paginate through invoices', async ({ page }) => {
    await page.goto('/dashboard/invoices');

    // Check if pagination exists (depends on number of invoices)
    const pagination = page.locator('[aria-label="pagination"]').or(
      page.getByRole('navigation'),
    );

    // If there's pagination, test it
    const paginationExists = await pagination.count();
    if (paginationExists > 0) {
      // Try to click page 2 if it exists
      const page2Link = page.getByRole('link', { name: '2' });
      const page2Exists = await page2Link.count();

      if (page2Exists > 0) {
        await page2Link.click();
        await expect(page).toHaveURL(/page=2/);
      }
    }
  });
});

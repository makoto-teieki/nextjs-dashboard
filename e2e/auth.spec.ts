import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 * Tests the login flow and authentication functionality
 */

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');

    // Check for login form elements
    await expect(page.getByRole('heading', { name: /please log in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill in invalid credentials
    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');

    // Submit form
    await page.getByRole('button', { name: /log in/i }).click();

    // Wait for error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill in valid credentials (from seed data)
    await page.getByLabel(/email/i).fill('user@nextmail.com');
    await page.getByLabel(/password/i).fill('123456');

    // Click login button
    await page.getByRole('button', { name: /log in/i }).click();

    // Wait for navigation to dashboard (with longer timeout for auth processing)
    await page.waitForURL('/dashboard', { timeout: 15000 });

    // Check for dashboard content
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('user@nextmail.com');
    await page.getByLabel(/password/i).fill('123456');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL('/dashboard', { timeout: 15000 });

    // Then logout
    await page.getByRole('button', { name: /sign out/i }).click();

    // Should redirect to login page
    await expect(page).toHaveURL('/login');
  });

  test('should redirect to login when accessing protected route while logged out', async ({
    page,
  }) => {
    await page.goto('/dashboard');

    // Should be redirected to login page (with callback URL)
    await expect(page).toHaveURL(/\/login/);
  });

  test('should persist session after page reload', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('user@nextmail.com');
    await page.getByLabel(/password/i).fill('123456');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForURL('/dashboard', { timeout: 15000 });

    // Reload page
    await page.reload();

    // Should still be logged in
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });
});

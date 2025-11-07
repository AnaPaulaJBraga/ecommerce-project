const { test, expect } = require('@playwright/test');

test.describe('Register Page E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('campos vazios mostram erros', async ({ page }) => {
    await page.click('button[type="submit"]');

    const errors = page.locator('.error-msg');
    await expect(errors).toHaveCount(3);
    await expect(errors.nth(0)).toHaveText(/Insira um nome/i);
    await expect(errors.nth(1)).toHaveText(/Insira um email/i);
    await expect(errors.nth(2)).toHaveText(/Insira uma senha/i);
  });

  test('registro e login com sucesso', async ({ page }) => {
    await page.fill('input[name="nome"]', 'Ana Paula');
    await page.fill('input[name="email"]', 'anapaula2@test.com');
    await page.fill('input[name="senha"]', '123456');

    await page.click('button[type="submit"]');

    await expect(page.locator('.register-message')).toHaveText(/sucesso/i);

    await page.waitForTimeout(2100);
    await expect(page).toHaveURL('http://localhost:3001/');
  });

  test('falha no cadastro mostra mensagem de erro', async ({ page }) => {
    await page.fill('input[name="nome"]', 'Ana Paula');
    await page.fill('input[name="email"]', 'erro@test.com');
    await page.fill('input[name="senha"]', '123456');

    await page.click('button[type="submit"]');

    await expect(page.locator('.register-message')).toHaveText(/erro/i);
  });
});

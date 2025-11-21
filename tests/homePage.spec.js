const { test, expect } = require('@playwright/test');

test.describe('Home Page - InfoWorld', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
  });

  test('carrega a página Home e exibe o banner', async ({ page }) => {
    await expect(page.getByText('Bem-vindo à InfoWord')).toBeVisible();
    await expect(page.getByAltText('Logo InfoWord')).toBeVisible();
  });
});

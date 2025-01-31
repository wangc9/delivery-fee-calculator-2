import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const cartValue = page.getByTestId("form-cart-value-input");
  const venueSlug = page.getByTestId("form-venue-slug-input");
  const userLatitude = page.getByTestId("form-user-latitude-input");
  const userLongitude = page.getByTestId("form-user-longitude-input");

  // Expect a title "to contain" a substring.
  await expect(cartValue).toBeVisible();
  await expect(venueSlug).toBeVisible();
  await expect(userLatitude).toBeVisible();
  await expect(userLongitude).toBeVisible();
});

test("get correct result with manual input of location", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const cartValue = page.getByTestId("form-cart-value-input");
  const venueSlug = page.getByTestId("form-venue-slug-input");
  const userLatitude = page.getByTestId("form-user-latitude-input");
  const userLongitude = page.getByTestId("form-user-longitude-input");

  await venueSlug
    .getByLabel("venue slug")
    .fill("home-assignment-venue-helsinki");
  await cartValue.getByLabel("cart value").fill("10.00");
  await userLatitude.getByLabel("user latitude").fill("60.17094");
  await userLongitude.getByLabel("user longitude").fill("24.93087");

  await page.getByTestId("form-submit-button").click();

  await expect(page.getByTestId("cart-value-result")).toHaveText("10 €");
  await expect(page.getByTestId("delivery-fee-result")).toHaveText("1.9 €");
  await expect(page.getByTestId("delivery-distance-result")).toHaveText(
    "176.54 m"
  );
  await expect(page.getByTestId("delivery-surcharge-result")).toHaveText("0 €");
  await expect(page.getByTestId("total-price-result")).toHaveText("11.9 €");
});

import { expect, test } from "@playwright/test";

test.describe("application form", () => {
  test("shows translated errors and focuses the first invalid field", async ({
    page,
  }) => {
    await page.goto("/basvuru");
    await page.getByRole("button", { name: "Başvuruyu gönder" }).click();

    await expect(
      page.getByText("Formda düzeltilmesi gereken 5 alan var."),
    ).toBeVisible();
    await expect(page.getByLabel("Tarife", { exact: true })).toBeFocused();
    await expect(page.getByLabel("Ad soyad")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(
      page.getByLabel("Telefon", { exact: true }),
    ).toHaveAccessibleDescription(/Geçerli bir telefon/);
  });

  test("rejects an invalid phone number but keeps what was typed", async ({
    page,
  }) => {
    await page.goto("/basvuru?plan=home-10");
    await page.getByLabel("Ad soyad").fill("Test Kullanıcı");
    await page.getByLabel("Telefon", { exact: true }).fill("12345");
    await page
      .getByLabel("Kurulum adresi")
      .fill("Test Mahallesi, Deneme Sokak No 1, Toroslar");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Başvuruyu gönder" }).click();

    await expect(page.getByLabel("Telefon", { exact: true })).toBeFocused();
    await expect(page.getByLabel("Ad soyad")).toHaveValue("Test Kullanıcı");
    await expect(page.getByLabel("Tarife", { exact: true })).toHaveValue(
      "home-10",
    );
  });

  test("a valid application succeeds and says nothing was sent", async ({
    page,
  }) => {
    await page.goto("/basvuru?plan=eko-24-5");
    await page.getByLabel("Ad soyad").fill("Test Kullanıcı");
    await page
      .getByLabel("Telefon", { exact: true })
      .fill("+90 (532) 123-45-67");
    await page
      .getByLabel("Kurulum adresi")
      .fill("Test Mahallesi, Deneme Sokak No 1, Toroslar");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Başvuruyu gönder" }).click();

    const status = page.getByRole("status");
    await expect(
      status.getByRole("heading", { name: "Başvurunuz alındı" }),
    ).toBeFocused();
    await expect(status).toContainText("Eko Paket 24/5 Mbps");
    await expect(status).toContainText("Akdeniznet'e iletilmedi");
  });

  test("works in English", async ({ page }) => {
    await page.goto("/en/apply");
    await page.getByRole("button", { name: "Send application" }).click();
    await expect(page.getByText("5 fields need fixing.")).toBeVisible();
  });
});

test.describe("contact form", () => {
  test("needs a phone number or an email address", async ({ page }) => {
    await page.goto("/iletisim");
    await page.getByLabel("Ad soyad").fill("Test Kullanıcı");
    await page
      .getByLabel("Mesajınız")
      .fill("Merhaba, kapsama alanı hakkında bilgi almak istiyorum.");
    await page.getByRole("button", { name: "Mesajı gönder" }).click();
    await expect(
      page.getByLabel("Telefon", { exact: true }),
    ).toHaveAccessibleDescription(/en az birini/);

    await page.getByLabel("E-posta", { exact: true }).fill("test@example.com");
    await page.getByRole("button", { name: "Mesajı gönder" }).click();
    await expect(
      page.getByRole("heading", { name: "Mesajınız alındı" }),
    ).toBeVisible();
  });
});

test("the map loads only when asked for", async ({ page }) => {
  const mapRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("google.com/maps"))
      mapRequests.push(request.url());
  });
  await page.goto("/iletisim");
  await page.waitForTimeout(1000);
  expect(mapRequests).toEqual([]);

  await page.getByRole("button", { name: "Haritayı göster" }).click();
  await expect(
    page.locator('iframe[title="Akdeniznet ofisinin haritası"]'),
  ).toBeVisible();
});

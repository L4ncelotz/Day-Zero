import { test, expect } from "@playwright/test";

test.describe("Internship Countdown Public Experience", () => {
  test("should render main countdown page with correct initial title and values", async ({ page }) => {
    await page.goto("http://localhost:3000/");

    // Check title & eyebrow text
    await expect(page).toHaveTitle(/Internship Countdown/);
    await expect(page.getByText("INTERNSHIP COUNTDOWN")).toBeVisible();

    // Check mode toggle buttons
    const workingToggle = page.getByRole("button", { name: "วันทำงาน" });
    const calendarToggle = page.getByRole("button", { name: "วันทั้งหมด" });

    await expect(workingToggle).toBeVisible();
    await expect(calendarToggle).toBeVisible();

    // Toggle to calendar mode
    await calendarToggle.click();
    await expect(page.getByText("วันทั้งหมด")).toBeVisible();

    // Toggle back to working mode
    await workingToggle.click();
    await expect(page.getByText("วันทำงาน")).toBeVisible();
  });

  test("should open Count Method Dialog when clicking ดูวิธีนับ", async ({ page }) => {
    await page.goto("http://localhost:3000/");

    const dialogButton = page.getByRole("button", { name: /ดูวิธีนับ/i });
    await dialogButton.click();

    await expect(page.getByText("เงื่อนไขและวิธีคำนวณวันนับถอยหลัง")).toBeVisible();
    await expect(page.getByText("วันทำงานปกติ:")).toBeVisible();
  });
});

test.describe("Admin Control Room Authentication", () => {
  test("should display login form for unauthenticated users and reject wrong password", async ({ page }) => {
    await page.goto("http://localhost:3000/control-room");

    await expect(page.getByText("Schedule Control Room")).toBeVisible();

    const passwordInput = page.getByPlaceholder("รหัสผ่าน");
    await passwordInput.fill("wrongpassword");

    const submitButton = page.getByRole("button", { name: /เข้าสู่ระบบ/i });
    await submitButton.click();

    await expect(page.getByText("รหัสผ่านไม่ถูกต้อง")).toBeVisible();
  });
});

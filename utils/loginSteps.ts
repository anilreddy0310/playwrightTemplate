import { Page } from "playwright";

export async function fillLoginData(
  page: Page,
  userName: string,
  password: string
) {
  await page.fill('input[id="username"]', userName);
  await page.fill('input[name="password"]', password);
  await page.getByRole("button", { name: "LOGIN" }).click();
}

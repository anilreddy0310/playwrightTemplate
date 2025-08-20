import { Page } from "playwright";
import { fillLoginData } from "./utils/loginSteps";
import path from "path";

/**
 * Login and save session for a given role.
 * @param page - The Playwright page object
 * @param userName - Username for login
 * @param password - Password for login
 * @param url - Base URL for the application
 * @param role - The role of the user (e.g., 'admin', 'cra')
 */
export async function loginAndSaveSession(
  page: Page,
  userName: string,
  password: string,
  url: string,
  role: string
): Promise<Page> {
  const storageStatePath = path.join(
    process.cwd(),
    `${role}_storageState.json`
  );

  await page.goto(url);
  await page.waitForLoadState("domcontentloaded");

  await page.evaluate(() => {
    sessionStorage.clear();
    localStorage.clear();
  });
  await page.reload();
  await fillLoginData(page, userName, password);
  await page.waitForLoadState("networkidle");
  await page.context().storageState({ path: storageStatePath });
  return page;
}

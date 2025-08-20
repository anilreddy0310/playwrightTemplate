// import { Browser, BrowserContext, Page } from "@playwright/test";

// /**
//  * Logs in a user and returns a new browser context.
//  * @param browser - The browser instance.
//  * @param url - The URL to navigate to for login.
//  * @param username - The username for login.
//  * @param password - The password for login.
//  * @returns A new browser context after login.
//  */
// export async function login(
//   browser: Browser,
//   url: string,
//   username: string,
//   password: string
// ): Promise<BrowserContext> {
//   const context = await browser.newContext();
//   const page = await context.newPage();
//   await page.goto(url);
//   await submitLoginForm(page, username, password);
//   await page.close();
//   return context;
// }

// /**
//  * Submits the login form with the provided credentials.
//  * @param page - The page instance.
//  * @param username - The username for login.
//  * @param password - The password for login.
//  */
// export async function submitLoginForm(
//   page: Page,
//   username: string,
//   password: string
// ) {}

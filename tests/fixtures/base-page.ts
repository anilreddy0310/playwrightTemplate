import { Browser, Page } from "playwright";
import path from "path";
import { fillLoginData } from "../../utils/loginSteps";
import { users } from "../details/userDetails";
import settings from "../../settings";

export class SIMSBasePage {
  role: string;
  browser: Browser;
  page: Page;

  constructor(browser: Browser, role: string) {
    this.browser = browser;
    this.role = role;
  }

  private async createPageWithRoleSession(
    browserContext: Browser,
    role: string,
    url: string,
    username: string,
    password: string
  ): Promise<Page> {
    const storageStatePath = path.join(
      process.cwd(),
      `${role}_storageState.json`
    );
    let context;
    try {
      context = await browserContext.newContext({
        storageState: storageStatePath,
      });
      console.log(`Using existing session for role: ${role}`);

      const page = await context.newPage();
      const response = await page.goto(url);

      if (response && response.status() === 401) {
        throw new Error("Session expired, re-authenticating...");
      }

      return page;
    } catch (e) {
      console.log(`Session not found for role: ${role}. Logging in...`);
      context = await browserContext.newContext();
      const page = await context.newPage();

      await page.goto(url);
      await fillLoginData(page, username, password);
      await context.storageState({ path: storageStatePath });
      console.log(`Session created and saved for role: ${role}`);

      return page;
    }
  }

  async init() {
    const user = users.find((user) => user.role === this.role);
    if (!user) {
      throw new Error(`User for role ${this.role} not found`);
    }

    this.page = await this.createPageWithRoleSession(
      this.browser,
      this.role,
      settings.baseUrl || "",
      user.username,
      user.password
    );
  }

  async close() {
    await this.page.close();
  }
}

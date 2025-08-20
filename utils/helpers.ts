import { Browser, Page } from "@playwright/test";

export class ReusablePage {
  browser: Browser;

  constructor(browser: Browser) {
    this.browser = browser;
  }
  async newPage(): Promise<Page> {
    const page = await this.browser.newPage();
    return page;
  }
}

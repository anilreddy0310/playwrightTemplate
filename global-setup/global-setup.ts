import { chromium, Browser, BrowserContext, Page } from "playwright";

class BrowserManager {
  private browser: Browser | null = null;

  async launch(headless: boolean) {
    this.browser = await chromium.launch({ headless });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  getBrowser(): Browser {
    if (!this.browser) {
      throw new Error("Browser is not initialized.");
    }
    return this.browser;
  }
}

class ContextManager {
  private context: BrowserContext | null = null;

  constructor(private browser: Browser) {}

  async createContext() {
    this.context = await this.browser.newContext();
  }

  getContext(): BrowserContext {
    if (!this.context) {
      throw new Error("Context is not initialized.");
    }
    return this.context;
  }

  async closeContext() {
    if (this.context) {
      await this.context.close();
    }
  }
}

class PageManager {
  private page: Page | null = null;

  constructor(private context: BrowserContext) {}

  async createPage() {
    this.page = await this.context.newPage();
  }

  getPage(): Page {
    if (!this.page) {
      throw new Error("Page is not initialized.");
    }
    return this.page;
  }

  async closePage() {
    if (this.page) {
      await this.page.close();
    }
  }
}

class GlobalSetup {
  protected browserManager: BrowserManager;
  private contextManager: ContextManager;
  private pageManager: PageManager;

  constructor() {
    this.browserManager = new BrowserManager();
  }

  async start() {
    await this.browserManager.launch(false);
    this.contextManager = new ContextManager(this.browserManager.getBrowser());
    await this.contextManager.createContext();
    this.pageManager = new PageManager(this.contextManager.getContext());
    await this.pageManager.createPage();
    console.log("Global setup completed.");
  }

  async login(username: string, password: string, loginUrl: string) {
    const page: Page = this.pageManager.getPage();
    await page.goto(loginUrl);
    await page.fill('[id="username"]', username);
    await page.fill('[id="password"]', password);
    await page.getByRole("button", { name: "LOGIN" }).click();
    await page.waitForLoadState("networkidle");
    console.log("Login completed.");
  }

  async stop() {
    await this.pageManager.closePage();
    await this.contextManager.closeContext();
    await this.browserManager.close();
    console.log("Global setup stopped.");
  }
}

class HeadlessSetup extends GlobalSetup {
  async start() {
    console.log("Starting headless setup...");
    await this.browserManager.launch(true);
    await super.start();
  }
}

export async function runSetup(
  setupType: "headed" | "headless",
  credentials: { userName: string; password: string; url: string }
) {
  let setup: GlobalSetup;

  if (setupType === "headless") {
    setup = new HeadlessSetup();
  } else {
    setup = new GlobalSetup();
  }

  await setup.start();
  await setup.login(
    credentials.userName,
    credentials.password,
    credentials.url
  );
  await setup.stop();
}

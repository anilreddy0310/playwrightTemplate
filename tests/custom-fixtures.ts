import { test as base } from "@playwright/test";
import { SIMSBasePage } from "../tests/fixtures/base-page"; // Ensure this path is correct
import { users } from "../tests/details/userDetails"; // Ensure this path is correct

type MyFixtures = {
  basePage: SIMSBasePage;
  role: string;
};

export const test = base.extend<MyFixtures>({
  basePage: async ({ browser, role }, use) => {
    const user = users.find((user) => user.role === role);
    if (!user) {
      throw new Error(`User for role ${role} not found`);
    }

    const basePage = new SIMSBasePage(browser, role);
    await basePage.init();
    await use(basePage);
    await basePage.close();
  },
});

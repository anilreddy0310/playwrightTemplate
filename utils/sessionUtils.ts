import { test as baseTest, Page } from "@playwright/test";
import { SIMSBasePage } from "../tests/fixtures/base-page";
import { users } from "../tests/details/userDetails";

type Fixtures = {
  simBasePage: SIMSBasePage;
  pageDOM: Page;
};

export const customTest = baseTest.extend<Fixtures>({
  simBasePage: [
    async ({ browser }, use) => {
      const defaultRole = "admin";
      const user = users.find((user) => user.role === defaultRole);

      if (!user) {
        throw new Error(`User for role ${defaultRole} not found`);
      }

      const simBasePage = new SIMSBasePage(browser, defaultRole);
      await simBasePage.init();
      await use(simBasePage);
      await simBasePage.close();
    },
    { scope: "test" },
  ],
  pageDOM: async ({ simBasePage }, use) => {
    await use(simBasePage.page);
  },
});

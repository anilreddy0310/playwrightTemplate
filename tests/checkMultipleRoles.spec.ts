import settings from "../settings";
import { users } from "./details/userDetails";
import { customTest } from "../utils/sessionUtils";

customTest.describe.parallel("Session storage for Admin, CRA user", () => {
  customTest(
    "should use the session for CRA and check system administrator text",
    async ({ simBasePage, pageDOM }) => {
      const role = "CRA";
      const user = users.find((user) => user.role === role);

      if (!user) {
        throw new Error(`User for role ${role} not found`);
      }
      await simBasePage.init();

      console.log("Role set in test: ", role);
      await pageDOM.goto(settings.baseUrl || "");
      await pageDOM
        .getByRole("button", { name: "System Admin", exact: true })
        .click();
      await pageDOM.waitForTimeout(4000);
    }
  );

  customTest(
    "click on ETMF button using Admin session storage",
    async ({ simBasePage, pageDOM }) => {
      const role = "admin";
      const user = users.find((user) => user.role === role);

      if (!user) {
        throw new Error(`User for role ${role} not found`);
      }
      await simBasePage.init();

      console.log("Role in test: ", role);
      await pageDOM.goto(settings.baseUrl || "");
      await pageDOM.getByRole("button", { name: "ETMF", exact: true }).click();
      await pageDOM.waitForTimeout(5000);
      await pageDOM.close();
    }
  );
});

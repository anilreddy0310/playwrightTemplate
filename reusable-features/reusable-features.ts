import { FrameLocator, Page, expect } from "@playwright/test";

export default class ReusableFeatures {
  private page: Page;
  private SysAdminIframe: FrameLocator;
  //exception
  constructor(page: Page, SysAdminIframe: FrameLocator) {
    this.page = page;
    this.SysAdminIframe = SysAdminIframe;
  }

  /**
   * Logs in a user with the provided credentials.
   * @param userName - The username for login.
   * @param password - The password for login.
   * @returns The page instance after login.
   */
  public async login(userName: string, password: string): Promise<Page> {
    await this.page.getByLabel("Username or email").fill(userName);
    await this.page.getByLabel("Password").fill(password);
    await this.page.getByRole("button", { name: "LOGIN" }).click();
    return this.page;
  }

  /**
   * Navigates to the specified URL.
   * @param url - The URL to navigate to.
   */
  public async open(url: string): Promise<void> {
    await this.page.goto(url);
  }

  public async columns(numberOfColumns: number, columnName: string) {
    await this.SysAdminIframe.getByLabel("Select columns").click();
    const actualNumberOfColumns =
      await this.SysAdminIframe.locator('[type="checkbox"]').count();
    await expect(actualNumberOfColumns).toBe(numberOfColumns);
    await this.SysAdminIframe.getByPlaceholder("Search").fill(columnName);
    await this.SysAdminIframe.getByPlaceholder("Search").press("Enter");
    const checkedEle = await this.SysAdminIframe.getByRole("checkbox", {
      name: columnName,
      exact: true,
    });
    if (await checkedEle.isChecked()) {
      await checkedEle.uncheck();
      await this.SysAdminIframe.getByLabel("Select columns").click();
      await expect(
        this.SysAdminIframe.getByRole("columnheader", {
          name: columnName,
          exact: true,
        })
      ).not.toBeVisible();
    } else {
      await checkedEle.check();
      await this.SysAdminIframe.getByLabel("Select columns").click();
      await expect(
        this.SysAdminIframe.getByRole("columnheader", {
          name: columnName,
          exact: true,
        })
      ).toBeVisible();
    }
  }

  public async density(densityOption: string) {
    await this.SysAdminIframe.locator('[aria-label="Density"]').click();
    await this.SysAdminIframe.locator('[role="menuitem"]', {
      hasText: densityOption,
    }).click();
    const dataGrid = this.SysAdminIframe.getByRole("grid");
    if (densityOption === "Compact") {
      const headerHeight = await dataGrid.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.getPropertyValue("--DataGrid-headerHeight");
      });
      const rowHeight = await dataGrid.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.getPropertyValue("--height");
      });
      expect(headerHeight.trim()).toBe("39px");
      expect(rowHeight.trim()).toBe("36px");
    }
    if (densityOption === "Standard") {
      const headerHeight = await dataGrid.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.getPropertyValue("--DataGrid-headerHeight");
      });
      const rowHeight = await dataGrid.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.getPropertyValue("--height");
      });
      expect(headerHeight.trim()).toBe("56px");
      expect(rowHeight.trim()).toBe("52px");
    }
    if (densityOption === "Comfortable") {
      const headerHeight = await dataGrid.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.getPropertyValue("--DataGrid-headerHeight");
      });
      const rowHeight = await dataGrid.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.getPropertyValue("--height");
      });
      expect(headerHeight.trim()).toBe("72px");
      expect(rowHeight.trim()).toBe("67px");
    }
  }

  public async downloadAsCsv() {
    await this.SysAdminIframe.locator('[aria-label="Export"]').click();
    await this.SysAdminIframe.locator('[role="menuitem"]', {
      hasText: "Download as CSV",
    }).click();
    await this.SysAdminIframe.locator('[aria-label="Export"]').click();
  }

  public async print() {
    await this.SysAdminIframe.locator('[aria-label="Export"]').click();
    await this.SysAdminIframe.locator('[role="menuitem"]', {
      hasText: "Print",
    }).click();
    await this.SysAdminIframe.getByRole("button", { name: "Save" }).click();
  }

  public async filter(columnName: string, Operator: string, value?: string) {
    await this.SysAdminIframe.getByLabel("Show filters").click();
    await this.SysAdminIframe.getByLabel("Columns", { exact: true }).click();
    await this.SysAdminIframe.getByRole("option", {
      name: columnName,
      exact: true,
    }).click();

    await this.SysAdminIframe.getByLabel("Operator", { exact: true }).click();
    await this.SysAdminIframe.getByRole("option", {
      name: Operator,
      exact: true,
    }).click();
    if (Operator == "is not empty" || "is empty") {
      if (value !== undefined) {
        await this.SysAdminIframe.getByPlaceholder("Filter value").fill(value);
      }
    }
    await this.SysAdminIframe.getByText("1Filters").click();
    if (columnName === "Form Name") {
      const filteredRows = this.SysAdminIframe.locator(`[data-field="name"]`);
      const rowCount = await filteredRows.count();
      if (rowCount > 0) {
        expect(rowCount).toBeGreaterThan(0);
        const firstRow = await filteredRows.nth(1).textContent();
        expect(firstRow).toContain(value);
      } else {
        const noResultsMessage =
          await this.SysAdminIframe.getByText("No results found.").isVisible();
        expect(noResultsMessage).toBeTruthy();
      }
    } else {
      const filteredRows = this.SysAdminIframe.locator(
        `[data-field="${columnName.toLocaleLowerCase().replace(/ /g, "_")}"]`
      );
      const rowCount = await filteredRows.count();
      if (rowCount > 1) {
        for (let i = 1; i <= rowCount; i++) {
          expect(rowCount).toBeGreaterThan(1);
          const firstRow = await filteredRows.nth(i).textContent();
          expect(firstRow).toContain(value);
        }
      } else {
        const noResultsMessage =
          await this.SysAdminIframe.getByText("No results found.").isVisible();
        expect(noResultsMessage).toBeTruthy();
      }
    }
  }
}

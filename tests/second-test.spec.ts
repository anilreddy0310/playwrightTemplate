import { test } from "@playwright/test";
import { ReusablePage } from "../utils/helpers";

test("should use multiple pages for different urls", async ({
  browser,
  page,
}) => {
  const s1Instance = new ReusablePage(browser);

  const s1Page = await s1Instance.newPage();
  await s1Page.goto("https://unity.pihealth.qa8.dev.fics.ai");

  const s2Instance = new ReusablePage(browser);

  const s2Page = await s2Instance.newPage();
  await s2Page.goto("https://study-harmony.pihealth.qa8.dev.fics.ai");
});

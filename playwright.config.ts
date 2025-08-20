// playwright.config.ts
import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  timeout: 1000000,
  globalTimeout: 1000000,
  workers: process.env.CI ? 10 : undefined,
  use: {
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
    // {
    //   name: "firefox",
    //   use: { browserName: "firefox" },
    // },
    // {
    //   name: "webkit",
    //   use: { browserName: "webkit" },
    // },
  ],
  outputDir: "test-results/",
};

export default config;

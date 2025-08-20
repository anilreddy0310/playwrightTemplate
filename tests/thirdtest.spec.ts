import { test } from "@playwright/test";
import { runSetup } from "../global-setup/global-setup";

test("Login ", async () => {
  const credentials = {
    userName: "piadmin",
    password: "TestAdmin123",
    url: "https://unity.pihealth.qa8.dev.fics.ai/",
  };
  await runSetup("headless", credentials);
});

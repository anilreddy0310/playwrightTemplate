import dotenv from "dotenv";

dotenv.config();

export default {
  baseUrl: process.env.baseUrl,
  validUserName: "piadmin",
  validPassword: "TestAdmin123",
} as const;

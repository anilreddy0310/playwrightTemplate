import settings from "../../settings";

export const users = [
  {
    username: settings.validUserName || "",
    password: settings.validPassword || "",
    role: "admin",
  },
  { username: "sufiyaan@cra.com", password: "Welcome@123456", role: "CRA" },
];
// export const usersCount = users.length;

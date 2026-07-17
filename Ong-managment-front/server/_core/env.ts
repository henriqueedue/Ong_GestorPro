export const ENV = {
  cookieSecret: process.env.COOKIE_SECRET || "supersecret",
  databaseUrl: process.env.DATABASE_URL || "",
  isProduction: process.env.NODE_ENV === "production",
  apiUrl: process.env.API_URL || "http://localhost:3000",
  // ADICIONE ESTA LINHA:
  ownerOpenId: process.env.OWNER_OPEN_ID || "", 
};
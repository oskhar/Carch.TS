import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import "dotenv/config";

function generateRandomKey(length = 80): string {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

function updateEnvFile(jwtSecret: string, jwtSecretRefresh: string): void {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.error(".env file not found");
    process.exit(1);
  }

  let envContent = fs.readFileSync(envPath, "utf8");

  const jwtSecretRegex = /^JWT_SECRET=.*$/m;
  const jwtSecretRefreshRegex = /^JWT_SECRET_REFRESH=.*$/m;

  if (jwtSecretRegex.test(envContent)) {
    envContent = envContent.replace(jwtSecretRegex, `JWT_SECRET=${jwtSecret}`);
  } else {
    envContent += `\nJWT_SECRET=${jwtSecret}`;
  }

  if (jwtSecretRefreshRegex.test(envContent)) {
    envContent = envContent.replace(
      jwtSecretRefreshRegex,
      `JWT_SECRET_REFRESH=${jwtSecretRefresh}`
    );
  } else {
    envContent += `\nJWT_SECRET_REFRESH=${jwtSecretRefresh}`;
  }

  fs.writeFileSync(envPath, envContent, "utf8");
  console.log(
    "JWT_SECRET and JWT_SECRET_REFRESH have been updated successfully!"
  );
}

function main(): void {
  const jwtSecret = generateRandomKey(80);
  const jwtSecretRefresh = generateRandomKey(80);
  updateEnvFile(jwtSecret, jwtSecretRefresh);
}

main();

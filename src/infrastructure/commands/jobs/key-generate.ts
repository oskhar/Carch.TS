import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import "dotenv/config";

function generateRandomKey(length = 128): string {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

function updateEnvFile(newKey: string): void {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.error(".env file not found");
    process.exit(1);
  }

  let envContent = fs.readFileSync(envPath, "utf8");
  const keyRegex = /^APP_KEY=.*$/m;

  if (keyRegex.test(envContent)) {
    envContent = envContent.replace(keyRegex, `APP_KEY=${newKey}`);
  } else {
    envContent += `\nAPP_KEY=${newKey}`;
  }

  fs.writeFileSync(envPath, envContent, "utf8");
  console.log("APP_KEY has been updated successfully!");
}

function main(): void {
  const newKey = generateRandomKey(80);
  updateEnvFile(newKey);
}

main();

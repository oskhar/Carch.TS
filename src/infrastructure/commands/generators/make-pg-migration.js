const { Command } = require("commander");
const fs = require("fs");
const path = require("path");

const program = new Command();

program
  .arguments("<name>")
  .description("Generate a new migration")
  .action((name) => {
    if (!name) {
      console.error("Error: Name argument is required");
      process.exit(1);
    }

    const now = new Date();
    const year = String(now.getUTCFullYear()).padStart(4, "0");
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    const hours = String(now.getUTCHours()).padStart(2, "0");
    const minutes = String(now.getUTCMinutes()).padStart(2, "0");
    const seconds = String(now.getUTCSeconds()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}-${hours}${minutes}${seconds}`;

    const migrationName = `${formattedDate}-create-${name.toLowerCase()}-table`;
    const migrationClass = `${name.charAt(0).toUpperCase()}${name.slice(
      1
    )}Migration`;

    const targetDir = path.join(__dirname, "../../database/pg/migrations");
    const targetFile = path.join(targetDir, `${migrationName}.ts`);
    const stubFile = path.join(__dirname, "../../stubs/pg-migration.ts.stub");

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.readFile(stubFile, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading stub file:", err);
        return;
      }

      const fileContent = data
        .replace(/{MigrationClass}/g, migrationClass)
        .replace(/{tableName}/g, name.toLowerCase());

      fs.writeFile(targetFile, fileContent, (err) => {
        if (err) {
          console.error("Error writing migration file:", err);
          return;
        }

        console.log(
          `Migration ${migrationName} created successfully at ${targetFile}`
        );
      });
    });
  });

program.parse(process.argv);

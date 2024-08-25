const { Command } = require("commander");
const fs = require("fs");
const path = require("path");

const program = new Command();

program
  .arguments("<name>")
  .description("Generate a new seeder")
  .action((name) => {
    if (!name) {
      console.error("Error: Name argument is required");
      process.exit(1);
    }

    const seederName = name.charAt(0).toUpperCase() + name.slice(1);
    const targetDir = path.join(__dirname, "../../database/pg/seeder");
    const targetFile = path.join(targetDir, `${name}-seeder.ts`);
    const stubFile = path.join(__dirname, "../../stubs", "seeder.ts.stub");

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.readFile(stubFile, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading stub file:", err);
        return;
      }

      const fileContent = data.replace(/{SeederName}/g, seederName);

      fs.writeFile(targetFile, fileContent, (err) => {
        if (err) {
          console.error("Error writing seeder file:", err);
          return;
        }

        console.log(
          `Seeder ${seederName} created successfully at ${targetFile}`
        );
      });
    });
  });

program.parse(process.argv);

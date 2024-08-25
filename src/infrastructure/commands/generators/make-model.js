const { Command } = require("commander");
const fs = require("fs");
const path = require("path");

const program = new Command();

program
  .arguments("<name>")
  .description("Generate a new model")
  .action((name) => {
    if (!name) {
      console.error("Error: Name argument is required");
      process.exit(1);
    }

    name = name.toLowerCase();

    const modelClass = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    const targetDir = path.join(__dirname, "../../../domain", "models");
    const targetFile = path.join(targetDir, `${name}.ts`);
    const stubFile = path.join(__dirname, "../../stubs", "model.ts.stub");

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.readFile(stubFile, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading stub file:", err);
        return;
      }

      const fileContent = data.replace(/{ModelClass}/g, modelClass);

      fs.writeFile(targetFile, fileContent, (err) => {
        if (err) {
          console.error("Error writing model file:", err);
          return;
        }

        console.log(`Model ${name} created successfully at ${targetFile}`);
      });
    });
  });

program.parse(process.argv);

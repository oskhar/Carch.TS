const { Command } = require("commander");
const fs = require("fs");
const path = require("path");

const program = new Command();

program
  .arguments("<name>")
  .description("Generate a new router")
  .action((name) => {
    if (!name) {
      console.error("Error: Name argument is required");
      process.exit(1);
    }

    name = name.toLowerCase();

    const routerClass = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    const targetDir = path.join(__dirname, "../../../presentation", "routers");
    const targetFile = path.join(targetDir, `${name}-router.ts`);
    const stubFile = path.join(__dirname, "../../stubs", "router.ts.stub");

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (fs.existsSync(targetFile)) {
      console.error(`Error: Router ${name} already exists at ${targetFile}`);
      process.exit(1);
    }

    fs.readFile(stubFile, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading stub file:", err);
        return;
      }

      const fileContent = data
        .replace(/{RouterName}/g, name)
        .replace(/{RouterClass}/g, routerClass);

      fs.writeFile(targetFile, fileContent, (err) => {
        if (err) {
          console.error("Error writing router file:", err);
          return;
        }

        console.log(`Router ${name} created successfully at ${targetFile}`);
      });
    });
  });

program.parse(process.argv);

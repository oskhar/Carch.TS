const { Command } = require("commander");
const fs = require("fs");
const path = require("path");

const program = new Command();

program
  .arguments("<name>")
  .description("Generate a new repository and its interface")
  .action((name) => {
    if (!name) {
      console.error("Error: Name argument is required");
      process.exit(1);
    }

    name = name.toLowerCase();

    const repositoryClass = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    const repositoryInterface = `${repositoryClass}`;
    const targetDir = path.join(__dirname, "../../../src/domain/repositories");
    const targetInterfaceDir = path.join(
      __dirname,
      "../../../src/domain/interfaces/repositories"
    );
    const targetFile = path.join(targetDir, `${name}-repository.ts`);
    const targetInterfaceFile = path.join(
      targetInterfaceDir,
      `${name}-repository.ts`
    );
    const stubFile = path.join(__dirname, "../../stubs", "repository.ts.stub");
    const interfaceStubFile = path.join(
      __dirname,
      "../../stubs/interfaces/repositories",
      "repository.ts.stub"
    );

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (!fs.existsSync(targetInterfaceDir)) {
      fs.mkdirSync(targetInterfaceDir, { recursive: true });
    }

    if (fs.existsSync(targetFile) || fs.existsSync(targetInterfaceFile)) {
      console.error(
        `Error: Repository ${name} or its interface already exists`
      );
      process.exit(1);
    }

    fs.readFile(stubFile, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading repository stub file:", err);
        return;
      }

      const fileContent = data
        .replace(/{RepositoryName}/g, name)
        .replace(/{RepositoryClass}/g, repositoryClass);

      fs.writeFile(targetFile, fileContent, (err) => {
        if (err) {
          console.error("Error writing repository file:", err);
          return;
        }

        console.log(`Repository ${name} created successfully at ${targetFile}`);
      });
    });

    fs.readFile(interfaceStubFile, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading repository interface stub file:", err);
        return;
      }

      const interfaceContent = data
        .replace(/{RepositoryName}/g, name)
        .replace(/{RepositoryClass}/g, repositoryInterface);

      fs.writeFile(targetInterfaceFile, interfaceContent, (err) => {
        if (err) {
          console.error("Error writing repository interface file:", err);
          return;
        }

        console.log(
          `Repository interface ${name} created successfully at ${targetInterfaceFile}`
        );
      });
    });
  });

program.parse(process.argv);

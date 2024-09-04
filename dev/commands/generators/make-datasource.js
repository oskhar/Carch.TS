const { Command } = require("commander");
const fs = require("fs");
const path = require("path");

const program = new Command();

program
  .arguments("<name>")
  .description("Generate a new data-source")
  .action((name) => {
    if (!name) {
      console.error("Error: Name argument is required");
      process.exit(1);
    }

    name = name.toLowerCase();

    const useCaseClass = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    const targetDir = path.join(
      __dirname,
      "../../../src/infrastructure/data-sources",
      "sequelize"
    );
    const targetFile = path.join(targetDir, `sequelize-${name}-data-source.ts`);
    const stubFile = path.join(
      __dirname,
      "../../stubs",
      "sequelize-data-source.ts.stub"
    );

    const interfaceDir = path.join(
      __dirname,
      "../../../src/infrastructure/interfaces/data-sources"
    );
    const interfaceFile = path.join(interfaceDir, `${name}-data-source.ts`);
    const interfaceStubFile = path.join(
      __dirname,
      "../../stubs/interfaces/data-sources",
      "data-source.ts.stub"
    );

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (!fs.existsSync(interfaceDir)) {
      fs.mkdirSync(interfaceDir, { recursive: true });
    }

    if (fs.existsSync(targetFile) || fs.existsSync(interfaceFile)) {
      console.error(
        `Error: Use-case ${name} already exists at ${targetFile} or ${interfaceFile}`
      );
      process.exit(1);
    }

    fs.readFile(stubFile, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading stub file:", err);
        return;
      }

      const fileContent = data
        .replace(/{DataSourceClass}/g, useCaseClass)
        .replace(/{DataSourceName}/g, name);

      fs.writeFile(targetFile, fileContent, (err) => {
        if (err) {
          console.error("Error writing data-source file:", err);
          return;
        }

        console.log(`Use-case ${name} created successfully at ${targetFile}`);
      });
    });

    fs.readFile(interfaceStubFile, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading interface stub file:", err);
        return;
      }

      const interfaceContent = data
        .replace(/{DataSourceClass}/g, useCaseClass)
        .replace(/{DataSourceName}/g, name);

      fs.writeFile(interfaceFile, interfaceContent, (err) => {
        if (err) {
          console.error("Error writing interface file:", err);
          return;
        }

        console.log(
          `Use-case interface ${name} created successfully at ${interfaceFile}`
        );
      });
    });
  });

program.parse(process.argv);

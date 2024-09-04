const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const program = new Command();

const directories = ["generators", "jobs"];
const availableCommands = [];

function fileToCommand(fileName) {
  return fileName.replace(/\.js$/, "").replace(/\.ts$/, "").replace(/-/g, ":");
}

function runCommand(command, filePath, args) {
  const ext = path.extname(filePath);

  const stringArgs = args.map((arg) => arg.toString());

  if (ext === ".ts") {
    spawnSync("ts-node", [filePath, ...stringArgs], { stdio: "inherit" });
  } else if (ext === ".js") {
    spawnSync("node", [filePath, ...stringArgs], { stdio: "inherit" });
  } else {
    console.error(`Error: Unsupported file type ${ext}`);
    process.exit(1);
  }
}

directories.forEach((dir) => {
  const fullPath = path.join(__dirname, dir);

  fs.readdirSync(fullPath).forEach((file) => {
    const filePath = path.join(fullPath, file);

    if (!file.endsWith(".js") && !file.endsWith(".ts")) return;

    const commandName = fileToCommand(file);
    availableCommands.push(commandName);

    const cmd = program.command(commandName).description(`Run ${commandName}`);

    if (dir === "generators") {
      cmd.arguments("<name>");
    }

    cmd.action((...args) => {
      runCommand(commandName, filePath, args);
    });
  });
});

program
  .command("list")
  .description("List all available commands")
  .action(() => {
    console.log("Available commands:");
    availableCommands.forEach((cmd) => {
      console.log(`  - ${cmd}`);
    });
  });

program.parse(process.argv);

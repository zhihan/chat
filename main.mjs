import readline from 'readline'
import * as session from './session.mjs'

// Supported commands
const COMMANDS = new Map([
  ["load", "Load resources"],
  ["quit", "Quit the conversation"],
]);

/** Prompt the user and get the answer */
function question(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

/** load command */
async function load_resource() {
  const url = await question(`> Input the resource URL:\n`);
  try {
    session.load_resource(url);
    console.log("> Successfully loaded");
  } catch (error) {
    console.error("Failed to load:" + error);
  }
}

/** Handle user commands. */
function handle_command(user_input, rl) {
  const lowered = user_input.toLowerCase();
  if (!COMMANDS.has(lowered)) {
    return
  }

  if (lowered === "load") {
    load_resource(rl);
  } else if (lowered == "quit") {
    console.log("Bye!");
    return false;
  }
}

async function main(){
  const hints = Array.from(COMMANDS.entries()).map(
    ([cmd, desc]) => cmd + ": " + desc
  ).join(", ");
  let user_input = await question(`? (${hints})\n`);
  handle_command(user_input);
}

main();

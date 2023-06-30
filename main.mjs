import readline from 'readline'
import * as session from './session.mjs'

// Supported commands
const COMMANDS = new Map([
  ["load", "Load resources"],
  ["quit", "Quit the conversation (^D)"],
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
  const url = await question('> Input the resource URL:\n');
  try {
    await session.load_resource(url);
    console.log("> Successfully loaded");
  } catch (error) {
    console.error("??? Failed to load:" + error);
  }
}

/** Handle user commands. */
async function handle_command(user_input) {
  const lowered = user_input.toLowerCase();
  if (!COMMANDS.has(lowered)) {
    let res = await session.chat(user_input);
    return true;
  }
  if (lowered === "load") {
    await load_resource();
    return true;
  } else if (lowered == "quit") {
    return false;
  }
}

async function main() {
  let cont = true;
  while (cont) {
    const hints = Array.from(COMMANDS.entries()).map(
      ([cmd, desc]) => cmd + ": " + desc
    ).join(", ");
    let user_input = await question(`? (${hints})\n`);
    cont = await handle_command(user_input);
  }
}

main();

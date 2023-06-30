import chalk from 'chalk'
import readline from 'readline'
import * as session from './session.mjs'

// Supported commands
const COMMANDS = new Map([
  ["load", "Load doc"],
  ["quit", "Quit (^D)"],
  ["status", ""],
  ["answer", "Answer questions based on given facts"]
]);

/** Prompt the user and get the answer */
function question(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(chalk.cyan(prompt), (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

/** Callback for the load command. */
async function load_doc() {
  const url = await question('> Input the document:\n');
  try {
    await session.load_doc(url);
    console.log(chalk.green("Successfully loaded"));
  } catch (error) {
    console.error("??? Failed to load:" + error);
  }
}

/** Callback for the chat command. */
async function chat(user_input) {
  let res = await session.chat(user_input);
  console.log(chalk.cyan(`${res}`));
}

/** Chat based on search result. Retry if no search result found. */
async function answer() {
  let docs = [];
  while (docs.length === 0) {
    let query = await question('> Input the search query:\n');
    try {
      docs = await session.search(query);
    } catch (error) {
      console.error("??? Failed to search:" + error);
    }
  }
  const user_input = await question(`> What questions do you have?\n`);
  try {
    const res = await session.chat_with_docs(user_input, docs);
    console.log(chalk.cyan(`${res}`));
  } catch (error) {
    console.error("??? Failed:" + error);
  }
}

/** Handle user commands. */
async function handle_command(user_input) {
  const lowered = user_input.toLowerCase();
  if (!COMMANDS.has(lowered)) {
    const trimmed = user_input.trim();
    if (trimmed.length === 0) {
      return true;
    }

    await chat(user_input);
  }
  if (lowered === "load") {
    await load_doc();
  } else if (lowered == "quit") {
    return false;
  } else if (lowered == "status") {
    const status = session.status();
    console.log(chalk.green(status));
  } else if (lowered == "answer") {
    await answer();
  }
  return true;

}


const WELCOME = `
Welcome to a CLI to ChatGPT.
You can use me to interact with ChatGPT. In addition, you can load a reference document,
and I will answer your questions based on that reference.

Start by asking a question, or load a reference document.`

async function main() {
  console.log(chalk.cyan(WELCOME))
  let cont = true;
  while (cont) {
    const hints = Array.from(COMMANDS.entries()).map(
      ([cmd, desc]) => cmd + ": " + desc
    ).join(", ");
    let user_input = await question(chalk.gray(`(${hints})\n`));
    cont = await handle_command(user_input);
  }
}

main();

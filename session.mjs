import chalk from 'chalk'
import 'dotenv/config'  // Use .env config
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { TextLoader } from "langchain/document_loaders/fs/text";

/** Create a session with built-in memory. */
function new_session() {
  let model = new OpenAI({ temprature: 0.1 })
  let memory = new BufferMemory();
  let chain = new ConversationChain({ llm: model, memory: memory })
  return {
    resources: [],
    model,
    memory,
    chain,
  };
}

var session = new_session();

/** Load resource into langchain */
export async function load_resource(url) {
  console.log(`Loading ${url}`);
  const loader = new TextLoader(url);
  const docs = await loader.load();
  session.resources.push(docs);
}

/** Search the resources and find relevant information. */
export function search(search_query) {
  console.log(`searching '${search_query}'`)
  return ["search result"];
}

/** Send the chat to chatGPT and get the answer */
export async function chat(user_input) {
  // TODO: save context.
  const template = "{question}"
  const prompt = new PromptTemplate({
    template: template,
    inputVariables: ["question"],
  });
  console.log(chalk.gray("Thinking..."));
  const input = await prompt.format({ question: user_input });
  const res = await session.chain.call({ input });
  return res.response;
}

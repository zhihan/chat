import 'dotenv/config'  // Use .env config
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { TextLoader } from "langchain/document_loaders/fs/text";

/** Session is a module-level object containing states of the session. */
var session = {
    resources: [],
};

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
  const template = "{question}"
  const model = new OpenAI({temprature: 0.9});
  const prompt = new PromptTemplate({
    template: template,
    inputVariables: ["question"],
  });
  const chain = new LLMChain({ llm: model, prompt: prompt });
  const res = await chain.call({ question: user_input});
  console.log(res);
  return res;
}

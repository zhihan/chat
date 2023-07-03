import chalk from 'chalk'
import 'dotenv/config'  // Use .env config
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PromptTemplate } from "langchain/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { TextLoader } from "langchain/document_loaders/fs/text";

/** Create a session with built-in memory. */
async function new_session() {
  let model = new OpenAI({ temprature: 0.1 })
  let memory = new BufferMemory();
  let chain = new ConversationChain({ llm: model, memory: memory });
  let splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 20,
  });
  let vector_store = await HNSWLib.fromDocuments([], new OpenAIEmbeddings());
  return {
    documents: [],
    model,
    splitter,
    memory,
    chain,
    vector_store,
  };
}

var session = await new_session();

/** Load resource into langchain */
export async function load_doc(url) {
  const loader = new TextLoader(url);
  const docs = await loader.load();
  const splitted = await session.splitter.splitDocuments(docs);
  await session.vector_store.addDocuments(splitted);
  session.documents.push(...splitted);
}

/** Search the resources and find relevant information. */
export async function search(query) {
  let search_result = await session.vector_store.similaritySearch(query);
  return search_result;
}

/** Send the chat to chatGPT and get the answer */
export async function chat_with_docs(question, docs) {
  // TODO: save context.
  const template = `
  You are a personal assistant. Answer the question based on
  the result of these content. Respond 'I don't know' if the
  information is irrelevant.
  ===
  {content}
  ===
  Question: {question}
  `
  const prompt = new PromptTemplate({
    template: template,
    inputVariables: ["content", "question"],
  });
  const content = docs.map(doc => doc.pageContent).join("\n\n");
  console.log(chalk.gray(`Thinking... (${docs.length} references)`));
  const input = await prompt.format({ content, question });
  const res = await session.chain.call({ input });
  return res.response;
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

/** Generate a summary of the current session */
export function status() {
  if (session.documents.length === 0) {
    return "no documents";
  }
  const docs = session.documents.map(doc => doc.metadata.source).join(", ");
  return `${session.documents.length} documents: ${docs}`;
}

/** Write a summary of the conversation today */
export async function summary() {
  // TODO: save context.
  const input = `
  You are a personal assistant. Please write a summary of our conversation
  so far. Write in the following format:
  We discussed {certain topics}. You asked about {these things}. Here is a
  summary of {my answer}.
  `
  console.log(chalk.gray(`Summarizing...`));
  const res = await session.chain.call({ input });
  return res.response;
}

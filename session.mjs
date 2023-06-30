import { TextLoader } from "langchain/document_loaders/fs/text";

/** Session is a module-level object containing states of the session. */
var session = {
    resources: [],
};

// Load resource into langchain
export async function load_resource(url) {
  console.log(`Loading ${url}`);
  const loader = new TextLoader(url);
  const docs = await loader.load();
  session.resources.push(docs);
}


// Search the resources and find relevant information.
export function search(search_query) {
  console.log(`searching '${search_query}'`)
  return ["search result"];
}

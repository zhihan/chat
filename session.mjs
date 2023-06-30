/** Session is a module-level object containing states of the session. */
var session = {
    resources: [],
};

// Load resource into langchain
export function load_resource() {

}


// Search the resources and find relevant information.
export function search(search_query) {
    console.log(`searching '${search_query}'`)
    return ["search result"];
}

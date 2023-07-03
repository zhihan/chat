# A Simple Program for Q&A Over Document
A node.js implementation of a simple chat program using the tutorials on
langchain.

This is a small CLI application I created to experiment with OpenAI and
langchain. The use case is [question and answer over documents](https://docs.langchain.com/docs/use-cases/qa-docs).

Here is an illustrated conversation. In this demo, I used
[Google's Javascript Style Guide](https://google.github.io/styleguide/jsguide.html) as the
reference document. Google standarizes on the Closure compiler, but users are free
to select their own testing framework. As you can see in the demo below, by
choosing a low temperature, and using langchain to provide the prompt, the
program can query ChatGPT to get the correct answer.

```
load
> Input the document:
guide.txt
Successfully loaded
answer
> Input the search query:
compiler
> What questions do you have?
What is the recommended compiler?
Thinking... (4 references)
 The recommended compiler is Closure Compiler.

answer
> Input the search query:
compiler
> What questions do you have?
What does the compiler do?
Thinking... (4 references)
 The Closure Compiler performs type checking and other checks, optimizations and other transformations
 (such as ECMAScript 6 to ECMAScript 5 code lowering).

answer
> Input the search query:
testing
> What questions do you have?
What testing framework should I use?
Thinking... (4 references)
 I don't know.

summary
Summarizing...
 We discussed the Google JavaScript Style Guide. You asked about the recommended compiler,
 what it does, and the testing framework to use. Here is a summary of my answer: The recommended
 compiler is Closure Compiler and it performs type checking and other checks, optimizations
 'and other transformations (such as ECMAScript 6 to ECMAScript 5 code lowering).
 I don't know which testing framework to use.
```

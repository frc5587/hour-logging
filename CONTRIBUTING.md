# Contributing to Hour Logging

Contributing is super simple! Setting up and leveraging a development environment is detailed in the README, so detailed below is a brief description of the architecture of the app and guidelines for creating good issues and pull requests in this repository.

## Architecture

The frontend of the application is built on Vue, with the code that interfaces with the backend located in [`src/api.js`](src/api.js). Most of the logic outside of interaction with the server is contained in [`src/App.vue`](src/App.vue). All components other than the App itself are stored in [`src/components`](src/components), so look there to fine-tune any component's styling or functionality.

The backend is a simple Node.js server built with Express and is entirely contained in [`src/server.js`](src/server.js). The per-user configuration options for the server (i.e. the MySQL username and password) are pulled from [`src/credentials.json`](src/credentials.json). This server exposes endpoints to retrieve information via JSON in order to provide a bridge between the Vue frontend and the local MySQL server that stores all of the information for the app.

## Reporting Issues

If you encounter any issues with the hour logging system, simply create an issue on GitHub (preferably with either the bug or feature template) and include the following information:

- Your machine's operating system
- The browser that the issue occurs in
- The version of Node being used, which can be retrieved with `node -v` 
- The version of Vue being used, which can be retrieved with  `vue --version`
- A screenshot or error log from the console that shows the error

## Creating a Pull Request

Pull requests for new features, bug fixes, etc. are greatly appreciated! Just make sure of a few things before submitting your PR

1. Running `npm run build` then `npm start` results in no errors
2. You have an issue filed that has to do with the changes in the PR
3. You [link the associated issue](https://github.com/blog/957-introducing-issue-mentions) in the PR

## Resources

If you want to help, but don't know enough about any aspect of the project, simply take a look at some of the following resources:

 - [Vue Guide](https://vuejs.org/v2/guide/)
 - [Getting Started with Node.js](https://codeburst.io/getting-started-with-node-js-a-beginners-guide-b03e25bca71b)
 - [Basics of Express](https://www.freecodecamp.org/news/going-out-to-eat-and-understanding-the-basics-of-express-js-f034a029fb66/)
 - [W3Schools SQL Guide](https://www.w3schools.com/sql/default.asp)

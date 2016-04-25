##Wazee UI Components


###Installation

Requirements:

- NodeJS

Installation:

```bash
npm install
```

To run: - this will create the /dist/dev directory and spin up a local server for development

```bash
npm start
```

To run unit test: - this will create the /test directory, build a production ready version of the app and run all unit tests with Karma and phantomJS2. 

```bash
npm test
```
To build a production version and spin up a server locally so that you can view what will be in production. 

```bash
npm run serve.prod
```

To build a production version for deploy: - this will create the /dist/prod directory so that you can deploy to a web server. It will also automatically run the unit tests, if they fail so will the build. 


To build a production version for deploy: - this will create the /dist/prod directory so that you can deploy to a web server. It will also automatically run the unit tests, if they fail so will the build. 
```bash
npm run build.prod
```

To build an exportable library: - this will create the /dist/library directory so that it can be loaded as a node module in other applications. 

```bash
npm run build.library
```


To build docs: - this will create the /docs directory and create a static website that documents the TypeScript Code. 

npm run build.library
```

To build docs: - this will create the /docs directory and create a static website that documents the TypeScript Code. 
```bash

npm run docs
```

###Usage

A UI componenet library

# Backend Documentation

## Table of Contents

1. [Backend Overview](#backend-overview)
2. [API Documentation](#api-documentation)
   - [Schema Overview](#schema-overview)
   - [Queriues](#queries)
   - [Mutations](#mutations)
   - [Authentication](#authentication)
   - [Error Handling](#error-handling)
   - [Tooling and Integration](#tooling-and-integration)
3. [Database](#database)
   - [User Model](#user-model)
   - [Plant Model](#plant-model)
4. [Files Descriptions](#file-descriptions)
   - [app.js](#app)
   - [graphql](#graphql)
     - [index.js](#graphql-index)
     - [resolvers](#graphql-resolvers)
       - [index.js](#resolvers-index)
       - [plantResolvers.js](#resolvers-plantresolvers)
       - [userResolvers.js](#resolvers-userresolvers)
       - [countriesResolvers.js](#resolvers-countryresolvers)
     - [schemas](#graphql-schemas)
       - [index.js](#schemas-index)
       - [plantSchema.js](#schemas-plantschema)
       - [userSchema.js](#schemas-userschema)
       - [countrySchema.js](#schemas-countryschema)
   - [database](#database-folder)
     - [plant.js](#plant)
     - [user.js](#user)
   - [sanitizer.js](#sanitizer)
   - [authenticate.js]

## Backend Overview

The backend of this application is built using Node.js and Express.js. It uses Apollo Server to handle GraphQL queries and mutations. MongoDB is used as the database, with Mongoose as the ORM to interact with it.

### Explenations

#### Installation

For installing all project dependencies, run:

(bash)
npm install

#### Running the server

To start running the backend server, run:

(bash)
npm start

This command also runs the `nodemon`, which refreshes the server after changes in the code.

#### Genereting Documentation

This project uses `JSDoc` for generating documentation from comments in the code. To generate the documentation, run:

(bash)
npx jsdoc -c jsdoc.json

#### Viewing the Documentation

You can view documentation by opening the `index.html` file located in the `docs` directory in your web browser. To do it, run:

(bash)
start docs/index.html

## API Documentation

### Schema Overview

The GraphQL schema defines the structure of the API, including types, queries, and mutations.

#### Types

The API consists of two main types:

- [**User**](/src/graphql/schemas/userSchema.js): Represents a user in the system.
- [**Plant**](/src/graphql/schemas/plantSchema.js): Represents a plant entry in the database.

#### Inputs

Input types define the shape of data that can be passed to mutations.

- [**UserInput**](/src/graphql/schemas/userSchema.js): Defines the structure for creating a new user.
- [**PlantInput**](/src/graphql/schemas/plantSchema.js): Defines the structure for creating a new plant entry.

#### Queries

Queries allow clients to fetch data from the server.

- [**verifyAuth**](/src/graphql/resolvers/userResolvers.js) Verifies the user's authentication status based on the provided token.
- [**getPlants**](/src/graphql/schemas/plantSchema.js): Fetches all plants stored in the database.
- [**getCountryNames**](/src/graphql/resolvers/countryResolvers.js): Fetches country names that match the given input name from the rest countries API.

#### Mutations

Mutations allow clients to modify data on the server.

- [**registerUser**](/src/graphql/schemas/userSchema.js): Creates a new user in the system and add user to the database.
- [**login**](/src/graphql/resolvers/userResolvers.js): Logs in a user and returns a JWT token.
- [**logout**](/src/graphql/resolvers/userResolvers.js): Logs out a user.
- [**createPlant**](/src/graphql/schemas/plantSchema.js): Adds a new plant entry to the database.

#### Authentication

All requests to the GraphQL API must include a valid authentication token in the Authorization header.

#### Error Handling

The API uses standard GraphQL error handling. Errors are returned in the `errors` field of the response.

#### Tooling and Integration

- **Apollo GraphQL Sandbox**

## Database

### User Model

[**userSchema**](/src/database/user.js)Defines the structure for storing user data.

### Plant Model

[**plantSchema**](/src/database/plant.js) Defines the structure for storing plant data.

## File Descriptions

### app

[**app.js**](/src/app.js) Sets up the Express server and Apollo Server for handling GraphQL requests.

### graphql

#### graphql index

[**graphql/index.js**](/src/graphql/index.js): Exports the combined type definitions and resolvers for the GraphQL server.

#### graphql resolvers

##### resolvers index

[**graphql/resolvers/index.js**](/src/graphql/resolvers/index.js): Combines the individual resolvers for different parts of the schema.

##### resolvers plantResolvers

[**graphql/resolvers/plantResolvers.js**](/src/graphql/resolvers/plantResolvers.js): Defines the resolvers for the `Plant` type.

##### resolvers userResolvers

[**graphql/resolvers/userResolvers.js**](/src/graphql/resolvers/userResolvers.js): Defines the resolvers for the `User` type.

##### resolvers countryResolvers

[**graphql/resolvers/countryResolvers.js**](/src/graphql/resolvers/countryResolvers.js): Defines the resolvers for the searching the countries names in the rest countries API.

#### graphql schemas

##### schemas index

[**graphql/schemas/index.js**](/src/graphql/schemas/index.js): Combines the individual schema files into a single schema.

##### schemas plantSchema

[**graphql/schemas/plantSchema.js**](/src/graphql/schemas/plantSchema.js): Defines the schema for the `Plant` type.

##### schemas userSchema

[**graphql/schemas/userSchema.js**](/src/graphql/schemas/userSchema.js): Defines the schema for the `User` type.

##### schemas countrySchema

[**graphql/schemas/countrySchema.js**](/src/graphql/schemas/countrySchema.js): Defines the schema for fetching the countries names.

### database folder

#### plant

[**database/plant.js**](/src/database/plant.js): Defines the Mongoose schema for the `Plant` model.

#### user

[**database/user.js**](/src/database/user.js): Defines the Mongoose schema for the `User` model.

## sanitizer

[**sanitizer.js**](/src/util/sanitizer.js): Exports a DOMPurify instance for sanitizing input data.

## authenticate

[**authenticate.js**](/src/util/authenticate.js): Exports middleware utility for verifying a user's authentication status using JSON Web Tokens (JWT). It checks the presence and validity of the token, decodes it, and retrieves the corresponding user from the database. If the token is invalid or expired, or if no user is found, an authentication error is thrown.

```

```

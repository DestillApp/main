# Application Architecture Documentation

## Overview

### Introduction

This document provides an overview of the architecture for our Vue.js application. It details the key components, their responsibilities, interactions, and the overall data flow within the system.

### Purpose

The purpose of this document is to:

- Provide a high-level understanding of the system's architecture.
- Serve as a reference for developers and stakeholders.
- Facilitate onboarding of new team members.

### Audience

This document is intended for:

- Developers
- Project Managers
- Stakeholders

### Explenations

#### Installation

For installing all project dependencies, run:

(bash)
npm install

#### Running the application

To start running the frontend server, run:

(bash)
npm run serve

#### Genereting Documentation

This project uses `JSDoc` for generating documentation from comments in the code. To generate the documentation, run:

(bash)
npx jsdoc -c jsdoc.json

#### Viewing the Documentation

You can view documentation by opening the `index.html` file located in the `docs` directory in your web browser. To do it, run:

(bash)
start docs/index.html

## Table of Contents

1. [High Level Structure](#high-level-structure)
   - [System Architecture](#system-architecture) []
   - [System Architecture Diagram](#system-architecture-diagram) []
2. [Vue Components Overview](#vue-components-overview)

   - [App](#app) [x]

   - [Layout Components](#layout-components)

     - [TheHeader](#theheader) [x]
     - [TheFooter](#thefooter) []

   - [Ui Components](#ui-components)

     - [BaseAutocompleteInput](#baseautocompleteinput) []
     - [BaseButton](#basebutton) [x]
     - [BaseCard](#basecard) [x]
     - [BaseModal](#basemodal) [x]
     - [BaseTextInput](#basetextinput) [x]
     - [BaseRadioInput](#baseradioinput) [x]
     - [BaseDatePicker](#basedatepicker) [x]
     - [BaseInputDatePicker](#baseinputdatepicker) [x]

   - [Pages Components](#pages-components)

     - [My Account Pages](#my-account-pages) []
       - [MyAccountPage](#myaccountpage) []
       - [InProgressDestillationsPage](#inprogressdestillationspage) []
       - [PlantListPage](#plantlistpage) []
       - [SavedDestillationsPage](#saveddestillationspage) []
       - [MyDataPage](#mydatapage) []
     - [AddPlant](#addplant) []
     - [AddDestillation](#adddestillation) []
     - [LoginPage](#loginpage) [x]
     - [MainPage](#mainpage) []
     - [RegistrationPage](#registrationpage) [x]

   - [Components](#components)
     - [Destillation Components](#destillation-components)
       - [DestillationForm](#destillation-form) []
     - [Plant Components](#plant-components)
       - [PlantForm](#plantform) [x]
       - [PlantIdentification](#plantidentification) [x]
       - [PlantOrigin](#plantorigin) [x]
       - [PlantData](#plantdata) [x]

3. [Helpers](#helpers)
   - [dateHelpers](#datehelpers) []
   - [displayHelpers](#displayhelpers) []
4. [Vuex Store Modules](#vuex-store-modules)
   - [Auth Module](#auth-module)
     - [index](#auth-index) []
     - [getters](#auth-getters) []
     - [actions](#auth-actions) []
     - [mutations](#auth-mutations) []
   - [Plant Module](#plant-module)
     - [index](#plant-index) [x]
     - [getters](#plant-getters) [x]
     - [actions](#plant-actions) [x]
     - [mutations](#plant-mutations) [x]
5. [Data Flow](#data-flow) []
6. [Deployment](#deployment) []
7. [Code References](#code-references)

## High-Level Structure

### System Architecture

#### Overview

The application consists of three main parts:

1. **Frontend:** Vue.js application responsible for the user interface.
2. **Backend:** Express.js server with Apollo Server, which handles GraphQL requests.
3. **Database:** MongoDB, where application data is stored.

#### Parts

##### Frontend

- **Vue.js:** is a component-based architecture promotes reusability and maintainability, allowing us to create modular and scalable user interfaces.

- **Vue Components:** Vue components are the building blocks of our frontend user interface. They encapsulate both the UI elements and the logic required to render and interact with them. These components include `RegistrationForm`, `LoginForm`, and many others, each fulfilling a specific function within the application.

- **Vuetify:** is a popular UI framework for Vue.js applications. It offers a rich set of Material Design components and utilities for building visually appealing and responsive user interfaces. In our application, Vuetify is utilized to design and style the user interface, providing consistent and aesthetic components throughout the application.

- **Vuex Store:** Vuex is a state management pattern and library for `Vue.js` applications. The Vuex store serves as a centralized store for all the state in our application. It enables us to manage shared state across multiple components, ensuring data consistency and providing a single source of truth for our application's data. Within the Vuex store, we define modules to organize our state, mutations to modify the state, actions to perform asynchronous operations, and getters to compute derived state based on the store's state.

- **Vue Router:** is the official router for `Vue.js`. It provides seamless navigation and routing functionalities for single-page applications. In our application, Vue Router is used to manage navigation between different views and pages, ensuring a smooth and intuitive user experience.

- **Apollo Client:** Apollo Client is a comprehensive state management library for managing application data in `Vue.js` applications. It integrates seamlessly with Vue and enables us to fetch and cache data from a `GraphQL` API with ease. Apollo Client provides a powerful GraphQL client that simplifies data fetching and management, allowing us to efficiently query our backend server and update our UI in response to changes in data. With Apollo Client, we can manage complex data requirements and ensure optimal performance in our Vue.js application.

- **GraphQL:** GraphQL is a query language for APIs that enables efficient data fetching and manipulation. In our frontend application, we use GraphQL to define and execute queries and mutations to interact with the backend server. GraphQL's declarative nature allows us to request only the data we need, reducing over-fetching and under-fetching of data. By leveraging GraphQL in our frontend, we can streamline data communication between the client and server, resulting in faster and more efficient data fetching and management.

##### Backend

- **Express.js:** Framework for building servers.
- **Apollo Server:** GraphQL server for handling queries.
- **Mongoose:** ORM for interacting with MongoDB.

More about backend you will find in backend-docs.md in the backend repository.

##### Database

- **MongoDB:** MongoDB is a popular NoSQL database that stores data in flexible, JSON-like documents. It offers a scalable, high-performance, and schema-less data storage solution for modern applications. In our application, MongoDB serves as the primary data store, storing various collections such as user data, application settings, and other relevant information. With MongoDB's rich query language, indexing capabilities, and replication features, we can efficiently store and retrieve data, ensuring reliability, scalability, and performance for our application's database operations.

### System Architecture Diagram

(Include a high-level architecture diagram of your application here. Use tools like Lucidchart, Draw.io, or any other diagramming tool to create this diagram.)

## Vue Components Overview

### App

#### Description

`App` is the root component of the application. It defines the main layout structure by incorporating the header, footer, and the dynamic content area managed by Vue Router.

#### Responsibilities

- Serve as the entry point for the application.
- Define the overall layout structure with a header, footer, and main content area.
- Facilitate navigation through `router-view`, which dynamically loads the appropriate component based on the current route.

#### Interactions

- **TheHeader Component:** Interacts with the header component to display navigation elements or branding.
- **TheFooter Component:** Interacts with the footer component to display footer information or links.
- **Router-View:** Uses Vue Router to load and display the appropriate component based on the current route, enabling navigation within the application.

### Layout Components

#### TheHeader

##### Description

`TheHeader` is a layout component that provides the header section of the application. It typically contains navigation elements, branding, and user-specific controls like login buttons.

##### Responsibilities

- Display the application's title or branding.
- Provide navigation links to different parts of the application.
- Include a login button for user authentication.
- Include a logout button for user logout when user is logged in.

##### Interactions

- **App Component:** Integrated into the `App` component to provide the header section for the main layout.
- **Router Links:** Contains navigation links that interact with Vue Router to change the current view/component.
- **BaseButton Component:** Utilizes `BaseButton` to create a consistent button style across the application.
- **SvgIcon Component:** Uses `SvgIcon` to include vector icons within the button.

#### TheFooter

##### Description

##### Responsibilities

##### Interactions

### Ui Components

#### BaseAutocompleteInput

##### Description

##### Responsibilities

##### Interactions

#### BaseButton

##### Description

`BaseButton` is a custom button component that uses Vuetify's `v-btn` component with an outlined variant. It accepts and displays content passed through a slot, allowing for flexible and reusable button elements throughout the application.

##### Responsibilities

- Render a button using Vuetify's `v-btn` component.
- Apply the outlined style to the button.
- Accept and display dynamic content through its slot.

##### Interactions

- **Parent Components:** Can be used in any parent component to provide a consistent button style. Content is passed to the button via the slot.
- **Vuetify:** Utilizes Vuetify's `v-btn` component to leverage its styling and functionality.

#### BaseCard

##### Description

`BaseCard` is a custom card component that provides a styled container for its content. It utilizes a slot to accept and display dynamic content, allowing for flexible and reusable card elements throughout the application.

##### Responsibilities

- Render a styled container for content.
- Accept and display dynamic content through its slot.

##### Interactions

- **Parent Components:** Can be used in any parent component to provide a consistent card style. Content is passed to the card via the slot.
- **Styling:** Provides a consistent look and feel for card elements across the application.

#### BaseModal

##### Description

`BaseModal` is a base modal component that provides a backdrop for modal content. It uses the Vue `teleport` feature to move the modal backdrop to the body element, ensuring it overlays correctly over all other content. The modal includes a slot for dynamic content and emits a `close-modal` event when the backdrop is clicked.

##### Responsibilities

- Render a modal backdrop and content slot.
- Emit a `close-modal` event when the backdrop is clicked to close the modal.
- Ensure the modal content overlays correctly by teleporting to the body element.

##### Interactions

- **Parent Components:** Can be used in any parent component to display modal content. The parent component should handle the `close-modal` event to manage the modal's visibility.
- **Child Components:** Typically contains other components or content within its slot.
- **Event Emission:** Emits `close-modal` when the backdrop is clicked to signal that the modal should be closed.

#### BaseTextInput

##### Description

`BaseTextInput` is a customizable text input component designed to handle various input types such as text, number, and time. It provides a label, an input field, and slots for additional content like units and messages. This component also emits events for value updates and keyboard interactions.

##### Responsibilities

- Render a text input field with a label.
- Conditionally style the input field based on the type (e.g., number, time).
- Handle input changes and emit corresponding events.
- Provide slots for additional content like units and messages.

##### Interactions

- **Parent Components:** Typically used in forms or other input-heavy components where user input is required. The parent component listens for emitted events to update its state.
- **Child Components:** Can include other components or elements within its slots.
- **Event Emission:**

  - `update:modelValue`: Emitted when the input value changes.
  - `set:keyboard`: Emitted when a keyboard event occurs.
  - `change:modelValue`: Emitted when the input value changes and loses focus.

#### BaseRadioInput

##### Description

`BaseRadioInput` is a radio group component that allows the user to select one option from a list of provided options. It uses Vuetify's radio group and radio components to render the radio buttons and handle user interactions. The component also provides a title and slots for additional messages.

##### Responsibilities

- Render a radio group with a list of options.
- Allow users to select one option from the list.
- Emit events when the selected option changes.
- Provide a title for the radio group and an optional slot for messages.

##### Interactions

- **Parent Components:** Used in forms or settings pages where the user needs to select an option from a predefined list. The parent component listens for emitted events to update its state.
- **Child Components:** Utilizes Vuetify's `v-radio-group` and `v-radio` components.
- **Event Emission:**

  - `update:modelValue`: Emitted when the selected option changes.
  - `selectOption`: Emitted when an option is selected.

  #### BaseDatePicker

  ##### Description

`BaseDatePicker` is a modal component that encapsulates a Vuetify date picker within a card. It allows users to select a date, which is then emitted to the parent component. This component leverages `BaseModal` for the modal functionality and `BaseCard` for styling the date picker container.

##### Responsibilities

- Display a modal with a date picker.
- Allow users to select a date.
- Emit the selected date to the parent component.

##### Interactions

- **Parent Components:** Used in forms or other components where a date selection is needed. The parent component listens for the emitted date value to update its state.
- **Child Components:** Utilizes `BaseModal` to provide modal functionality and `BaseCard` to style the date picker container.
- **Event Emission:**
  - `update:value`: Emitted when the selected date changes.

#### BaseInputDatePicker

##### Description

`BaseInputDatePicker` is a container component that integrates a text input and a date picker. It provides a user interface for selecting a date, displaying the selected date in a text input field, and controlling the visibility of the date picker through an SVG icon.

##### Responsibilities

- Display a text input for the selected date.
- Show and hide a date picker modal when the calendar icon is clicked.
- Emit the selected date to the parent component.

##### Interactions

- **Parent Components:** The parent component can provide initial date values and listen for date changes through emitted events.
- **Child Components:**
  - Utilizes `BaseTextInput` for the text input field.
  - Utilizes `BaseDatePicker` for the date picker modal.
  - Utilizes `SvgIcon` for the calendar icon.

### Pages Components

#### My Account Pages

##### MyAccountPage

##### InProgressDestillationsPage

##### PlantListPage

##### SavedDestillationsPage

##### MyDataPage

#### AddPlant

#### AddDestillation

##### Description

##### Responsibilities

##### Interactions

#### LoginPage

##### Description

The `LoginForm` component provides a user interface for logging into the application. It includes fields for email and password input, validates the entered data, and manages user authentication through interaction with Vuex and routing logic.

##### Responsibilities

- Render a login form with fields for email and password.
- Validate the login form to ensure that both email and password fields are filled.
- Sanitize input data to prevent security vulnerabilities.
- Handle form submission and interact with Vuex to authenticate the user.
- Redirect the user to their intended page or a default page upon successful login.
- Display validation messages if login fails.

##### Interactions

- **Parent Components:** This component can be used directly in views or layouts that require user authentication functionality.
- **Child Components:**
  - `BaseCard`: Provides a card-like container for the form.
  - `BaseTextInput`: Used for email and password input fields with labels and validation messages.
  - `BaseButton`: Used to submit the login form.
- **Vuex Store:**
  - `auth/login`: Action dispatched to handle user authentication.
- **Vue Router:**
  - Redirection: Uses the router to redirect users to a specific route upon successful login based on the query parameters or a default path (`/my-account`).

#### MainPage

##### Description

##### Responsibilities

##### Interactions

#### RegistrationPage

##### Description

The `RegistrationForm` component provides a user interface for new users to register an account. It includes fields for username, email, and password, validates the entered data, and handles user registration through a GraphQL mutation.

##### Responsibilities

- Render a registration form with fields for username, email, and password.
- Sanitize input data to prevent security vulnerabilities.
- Handle form submission and interact with the GraphQL API to register the user.
- Log the newly created user details upon successful registration.
- Provide a link to the login page for users who already have an account.

##### Interactions

- **Parent Components:** This component can be used directly in views or layouts where user registration is required.
- **Child Components:**
  - `BaseCard`: Provides a card-like container for the form.
  - `BaseTextInput`: Used for username, email, and password input fields.
  - `BaseButton`: Used to submit the registration form.
- **GraphQL:**
  - **Mutation:**
    - `registerUser`: Mutation to create a new user with provided input data.

### Components

#### Destillation Components

##### DestillationForm

###### Description

###### Responsibilities

###### Interactions

#### Plant Components

##### PlantForm

###### Description

`PlantForm` is a component responsible for rendering and handling the submission of a form that collects detailed information about a plant. It integrates several sub-components for different sections of the form and manages the form's validation and submission process.

###### Responsibilities

- Render a form for entering plant information.
- Integrate sub-components for plant identification, origin, and data entry.
- Validate the form data before submission.
- Submit the form data using a GraphQL mutation.
- Provide feedback on form validity.

###### Interactions

- **Parent Components:** None specified. This component is typically a self-contained form within a view.
- **Child Components:**

  - `PlantIdentification`: Handles the identification section of the plant form.
  - `PlantOrigin`: Manages the origin-related inputs for the plant.
  - `PlantData`: Manages the additional data inputs for the plant.
  - `BaseButton`: Used for form submission buttons.
  - `BaseCard`: Provides a styled card container for the form.

- **GraphQL API:**
  - **Mutations:**
    - `createPlant`: This mutation is used to create a new plant entry in the system.

##### PlantIdentification

###### Description

`PlantIdentification` is a component designed to capture and manage data related to plant materials used in the distillation process. This includes collecting the plant name and part, ensuring these inputs are validated, and updating the Vuex store with the provided values.

###### Responsibilities

- Render input fields for the plant name and plant part.
- Display validation messages if the inputs are invalid.
- Update the Vuex store with the input values.
- Fetch initial data from local storage upon component mount.

###### Interactions

- **Parent Components:** Typically used within a parent form component like `PlantForm`.
- **Child Components:**
  - `BaseTextInput`: Used for rendering the text input fields.
- **Vuex Store:**
  - **Getters:**
    - `plant/plantForm`: Retrieves the current state of the plant form data.
  - **Actions:**
    - `plant/setValue`: Updates a specific field in the plant form data.
    - `plant/fetchLocalStorageData`: Fetches initial data from local storage.

##### PlantOrigin

###### Description

`PlantOrigin` is a component designed for managing and inputting data related to the origin of plant materials used in distillation. It supports both harvested and purchased plant materials and includes functionality to handle relevant details such as harvest date, temperature, range, purchase date, producer information, and country of origin.

###### Responsibilities

- Render radio input options for selecting the plant origin (harvest or purchase).
- Conditionally display and manage additional input fields based on the selected plant origin:
  - If the origin is "zbiór" (harvest), display fields for harvest date, temperature, and time range.
  - If the origin is "kupno" (purchase), display fields for purchase date and producer name.
- Implement an autocomplete input for searching and selecting a country of origin.
- Display validation messages for required fields.
- Update the Vuex store with the input values.
- Fetch initial data from local storage upon component mount.

###### Interactions

- **Parent Components:** Typically used within a parent form component like `PlantForm`.
- **Child Components:**
  - `BaseInputDatePicker`: Used for selecting dates.
  - `BaseTextInput`: Used for text and number inputs.
  - `BaseRadioInput`: Used for radio input options.
  - `VRangeSlider`: Used for selecting a range of values (time range).
  - `BaseAutocompleteInput`: Used for autocomplete functionality to search and select a country.
- **Vuex Store:**
  - **Getters:**
    - `plant/plantForm`: Retrieves the current state of the plant form data.
    - `plant/harvestRange`: Retrieves the current state of the harvest range.
    - `plant/plantOrigin`: Retrieves the current plant origin.
  - **Actions:**
    - `plant/setValue`: Updates a specific field in the plant form data.
    - `plant/fetchLocalStorageData`: Fetches initial data from local storage.
    - `plant/setStartTime`: Sets the start time for the harvest range.
    - `plant/setEndTime`: Sets the end time for the harvest range.
    - `plant/setIntegerValue`: Updates a specific field with an integer value.

##### PlantData

###### Description

`PlantData` is a component designed to facilitate the input and management of data related to plant material used in distillation. It allows users to specify various attributes of the plant material, including weight, state, drying time, age, and soaking information. The component ensures accurate data entry through interactive and conditional input fields and real-time validation feedback.

###### Responsibilities

- Render input fields for entering plant weight, state, drying time, plant age, and soaking information.
- Conditionally display and manage additional input fields based on the selected plant state and soaking status:
  - Display the drying time input if the plant state is "podsuszony" (partially dried).
  - Display the plant age input if the plant state is "suchy" (dry).
  - Display soaking time and weight after soaking inputs if the plant is soaked.
- Display validation messages for required fields.
- Update the Vuex store with the input values.
- Fetch initial data from local storage upon component mount.

###### Interactions

- **Parent Components:** Typically used within a parent form component like `PlantForm`.
- **Child Components:**
  - `BaseTextInput`: Used for text and number inputs.
  - `BaseRadioInput`: Used for radio input options.
  - `VRangeSlider`: Used for selecting a range of values (soaking time range).
- **Vuex Store:**
  - **Getters:**
    - `plant/plantForm`: Retrieves the current state of the plant form data.
    - `plant/plantState`: Retrieves the current plant state.
    - `plant/isPlantSoaked`: Retrieves the current soaking status.
  - **Actions:**
    - `plant/setValue`: Updates a specific field in the plant form data.
    - `plant/fetchLocalStorageData`: Fetches initial data from local storage.
    - `plant/setNumberFormat`: Formats and updates a specific field with a numerical value.
    - `plant/setIntegerValue`: Updates a specific field with an integer value.
    - `plant/setKeyboardIntegerNumber`: Prevents non-integer keyboard input.
    - `plant/setKeyboardFormatedNumber`: Prevents non-formatted number keyboard input.
- **GraphQL API:**
  - **Queries:**
    - `GetCountryNames`: Fetches a list of country names based on a search query to populate the autocomplete input.

## Helpers

### DateHelpers

### DisplayHelpers

## Vuex Store Modules

### Auth Module

#### Auth Index

#### Auth Getters

#### Auth Actions

#### Auth Mutations

### Plant Module

#### Plant Index

##### Description

The Plant `index.js` module manages the state related to plant form data used in distillation. It includes fields for plant details such as name, part, origin, purchase information, harvest details, weight, state, drying information, and soaking information.

##### Responsibilities

- **Manage State**: Holds the state object representing the plant form data.
- **Update State**: Contains mutations for updating the state.
- **Perform Actions**: Includes actions for performing asynchronous tasks.
- **Access Data**: Provides getters for accessing state data.

##### Interactions

- **Usage**: Imported and used within Vuex store setup for managing plant-related data.
- **Mutations**: Utilizes mutations defined in `plant/mutations.js` for updating the state.
- **Actions**: Utilizes actions defined in `plant/actions.js` for performing asynchronous tasks.
- **Getters**: Utilizes getters defined in `plant/getters.js` for accessing state data.

#### Plant Getters

##### Description

The Plant `getters.js` module provides getters for accessing specific parts of the plant form state. These getters are used to retrieve data related to the plant form, harvest range, plant origin, plant state, and soaked status.

##### Responsibilities

- **Retrieve Data**: Provides functions to extract specific fields from the plant form state.
- **Access Plant Form**: Offers getters to access the overall plant form data.
- **Get Harvest Range**: Retrieves the harvest range from the plant form state.
- **Get Plant Origin**: Retrieves the plant origin from the plant form state.
- **Get Plant State**: Retrieves the plant state from the plant form state.
- **Check Soaked Status**: Determines whether the plant is soaked based on the form data.

##### Interactions

- **Usage**: Imported and used within Vuex store modules to retrieve specific parts of the plant form state.

#### Plant Actions

##### Description

The Plant `actions.js` module contains actions responsible for handling data fetching, local storage management, and form value setting within the Vuex store.

##### Responsibilities

- **Fetch Data**: Fetches data from local storage and commits it to the state.
- **Set Value**: Sets a value in the state.
- **Set Integer Value**: Sets an integer value in the state.
- **Change Start Time Format**: Commits the start time format change.
- **Change End Time Format**: Commits the end time format change.
- **Set Number Format**: Sets the number format in the state.

##### Interactions

- **Usage**: Imported and used within Vuex store modules to perform specific tasks related to data management.

#### Plant Mutations

##### Description

The Plant `mutations.js` module contains mutations responsible for updating the state of the plant form data within the Vuex store.

##### Responsibilities

- **Change Value**: Mutation to change the value of a field in the plant form.
- **Set Integer Number**: Mutation to set an integer value in the plant form.
- **Change Start Time Format**: Mutation to change the format of the start time for harvesting.
- **Change End Time Format**: Mutation to change the format of the end time for harvesting.
- **Change Number Format**: Mutation to change the format of a number value in the plant form.

##### Interactions

- **Usage**: Used within Vuex store modules to update the state based on specific actions or events.

# Data Flow

## Overview

Our `Vue.js` application follows a structured data flow process to manage data interactions between the frontend components and the backend server.

## Data Sources

- User Input
- GraphQL API Calls
- Database Queries

## Data Flow Steps

1. **User Interaction:**

   - Users interact with the application through the Vue components. `Vue` components encapsulate UI elements and logic.

2. **Event Emission:**

   - UI components emit events (e.g., form submission, button clicks) to trigger actions.

3. **State Management:**

   - `Vuex` store manages the application state and responds to emitted events by updating the state.

4. **Data Fetching:**

   - `Vuex` actions dispatch a `GraphQL` query using `Apollo Client` requests to fetch data from the backend server.

   ```javascript
   const query = graphql`query {
      // GraphQL query example
    }`;
   ```

5. **Server Interaction:**

   - Backend server processes `GraphQL` queries and mutations, interacts with the database, and generates responses.

6. **Data Processing:**

   - Received data is processed and transformed as needed before being sent back to the client.

7. **Data Presentation:**
   - Processed data is presented to the user through the UI components, completing the data flow cycle.

## Diagram

[Insert Data Flow Diagram Here]

## Example Scenario

Let's consider a scenario where a user submits a form to add a new item. The data flow would look something like this:

- User interacts with the form component and fills in the required fields.
- Upon form submission, an event is emitted from the form component.
- A Vuex action responsible for handling form submissions dispatches a GraphQL mutation to the backend server.
- The backend server processes the mutation, validates the data, and stores it in the database.
- Once the data is successfully stored, a response is sent back to the client.
- The Vuex store is updated with the new data.
- Any relevant components listening for changes in the Vuex store are updated to reflect the new data.

## Key Considerations

- Error handling mechanisms: []
- Data validation procedures: []
- Security measures (e.g., authentication, authorization):

  - **Sanitization with dompurify**: To mitigate the risk of cross-site scripting (XSS) attacks, we use dompurify to sanitize user-generated content and ensure that only safe, sanitized HTML is rendered in the application. This helps prevent malicious scripts from executing within our application, enhancing security and protecting user data.

# Deployment

##

# Code References

The Code References section provides essential links and descriptions to key parts of the codebase. This section is especially useful for new developers or anyone needing to understand or navigate the code more efficiently. It helps in quickly locating and understanding critical code components, common patterns, and significant implementations within the project.

## Structure of Code References

### Configuration and Initialization

- [**main.js**](/src/main.js): The main entry point for the Vue application. Initializes the Vue instance and mounts the app.
- [**router.js**](/src/router.js): Configures and initializes Vue Router, defining routes for the application.
- [**store.js**](/src/store/index.js): Sets up the Vuex store, combining all the modules and state management configurations.

### Key Modules

- [**Auth Module:**](/src/store/auth/)

  - [**index.js:**](/src/store/auth/index.js) Main entry point for the authentication module.

- [**Plant Module:**](/src/store/plant/)
  - [**index.js:**](/src/store/plant/index.js) Main entry point for the plant module.

### Important Components

- [**Components:**](/src/components/)

  - [**destillation:**](/src/components/destillation/)
    - [**DestillationForm:**](/src/components/destillation/DestillationForm.vue) Handles destillation data entered by the user in the form.
  - [**plant:**](/src/components/plant/)
    - [**PlantForm.vue:**](/src/components/plant/PlantForm.vue) Handles plant data entered by the user in the form.

- [**Layout:**](/src/layout/)

  - [**TheHeader.vue:**](/src/layout/TheHeader.vue) Contains the header of the app.
  - [**TheFooter.vue**](/src/layout/TheFooter.vue) Contains the footer of the app.

- [**Pages:**](/src/pages/)
  - [**LoginPage.vue:**](/src/pages/LoginPage.vue) Handles form with user authentication.
  - [**RegistrationPage.vue:**](/src/pages/RegistrationPage.vue) Handles form with user registration.

### Utility Functions

- [**dateHelpers.js:**](/src/helpers/dateHelpers.js)
- [**displayHelpers.js:**](/src/helpers/displayHelpers.js)

### GraphQL Queries and Mutations

- **GraphQL Queries:** Key GraphQL queries used in the application.

- **GraphQL Mutations:**
  - [**createPlant:**](/src/components/plant/PlantForm.vue) Mutation for adding a new plant. It is used in PlantForm.vue
  - [**registerUser:**](/src/pages/RegistrationPage.vue) Mutation for registration a new user. It is used in RegistrationPage.vue

### Styles and Themes

- [**global.css:**](/src/assets/styles/global.css) Contains the global styles for the application.

### Configuration Files

- [**vue.config.js:**](/vue.config.js) Configuration file for Vue CLI.
- [**apollo.config.js:**](/apollo.config.js) Configuration for Apollo Client.

## Purpose and Usage

The Code References section is intended to:

- **Help new developers** onboard quickly by providing direct links to critical parts of the code.
- **Serve as a quick reference** for anyone needing to locate and understand key functionalities within the project.
- **Ensure consistency** in how certain patterns and implementations are handled across the codebase.

/**
 * @module sanitizer
 * @description Exports a DOMPurify instance for sanitizing input data.
 */

// Importing JSDOM from the jsdom module to create a DOM environment
const { JSDOM } = require("jsdom");

// Importing the createDOMPurify function from the dompurify module
const createDOMPurify = require("dompurify");

// Creating a new JSDOM window instance
const window = new JSDOM("").window;

// Creating a DOMPurify instance using the created window
const DOMPurify = createDOMPurify(window);

// Exporting the DOMPurify instance for use in other parts of the application
module.exports = DOMPurify;

/**
 * Defines a simple mock API for front-end testing purposes.
 *
 * This API has five requests available:
 *    GET    /
 *    GET    /customers
 *    POST   /customers
 *    PUT    /customers
 *    DELETE /customers
 * 
 * No database connection is required, and the side-effects are only 
 * available when the API is running - as soon as it stops, the next
 * time it will reset everything (in regards to POST/PUT/DELETE).
 *
 * @file   app.js - Index of the node-api-mock project.
 * @author mdeamf
 * @since  2020-02-29
 * @link   https://documenter.getpostman.com/view/10557665/SzKZrvqz?version=latest
 * 
 * Importing the Customer typedef.
 * @typedef { import('./utils/customerFactory').Customer } Customer
 */

/**
 * MODULES
 * Importing the main modules of the application.
 * 
 * @member express         Web Framework to handle requests.
 * @member morgan          Responsible for logging the requests.
 * @member chalk           Colorize the console logs.
 * @member customerFactory A factory to generate a new customer.
 */
const express = require('express');
const morgan = require('morgan');
const chalk = require('chalk');
const customerFactory = require('./utils/customerFactory');

/**
 * CONSTANTS
 * Initializing the main constants of the API.
 * 
 * @member app  Main Express application instance.
 * @member port Port number where the API will listen for requests.
 */
const app = express();
const port = 8000;

/** @type {Array<Customer>} */
let customerExamples = require('./public/customerExamples.json');

/**
 * MIDDLEWARE
 * morgan         | Logging the requests
 * express.json() | Indicating we will use JSON as body.
 */
app.use(morgan('dev'));
app.use(express.json());

/**
 * GET /
 * @link https://documenter.getpostman.com/view/10557665/SzKZrvqz?version=latest#e391cdcf-9bd1-4ba8-bd8b-653dd3c33036
 */
app.get('/', (req, res) => res.send({
  hello: 'world'
}));

/**
 * GET /customers
 * @link https://documenter.getpostman.com/view/10557665/SzKZrvqz?version=latest#0dacaaea-8d36-45b7-bf00-977828c8fcd7
 */
app.get('/customers', (req, res) => {
  let result = customerExamples;

  // Filter by id, if it was sent.
  if (req.query.id) {
    result = result.filter(f => f.id === req.query.id);
  }

  // Filter by quantity, if it was sent.
  if (req.query.qty) {
    result = result.slice(0, req.query.qty);
  }

  res.send({
    customers: result
  });
});

/**
 * POST /customers
 * @link https://documenter.getpostman.com/view/10557665/SzKZrvqz?version=latest#d58a7296-d6c8-4410-b002-a4ad328b0582
 */
app.post('/customers', (req, res) => {
  /** @type { Customer } */
  let customerNew = customerFactory.generate(req);

  // Adding new customer to the array and returning the newly added object.
  customerExamples.push(customerNew);
  res.send(customerNew);
});

/**
 * PUT /customers
 * @link https://documenter.getpostman.com/view/10557665/SzKZrvqz?version=latest#c7d03ba5-c850-4653-b275-b11c0260b651
 */
app.put('/customers', (req, res) => {
  changeOrDelete(req, res, true);
});

/**
 * DELETE /customers
 * @link https://documenter.getpostman.com/view/10557665/SzKZrvqz?version=latest#ada3bcbe-fe5c-46ef-9f8b-2baea9a39a57
 */
app.delete('/customers', (req, res) => {
  changeOrDelete(req, res, false);
});

/**
 * EVERY OTHER REQUEST
 * Return a generic message.
 */
app.use('*', (req, res) => res.status(501).send({
  message: 'Route not found!'
}));

/**
 * ERROR HANDLER
 * Handling general errors. Very generic and simple
 */
app.use((err, req, res, next) => {
  // Print the error on the console. If it has a stack, we print it - else, just print the error itself.
  console.error(chalk.red(chalk.bold('\r\n[DEV] The following error happened:\r\n') + (err.stack || err) + '\r\n'));

  // If it's a string, it means we threw the error. Therefore, we consider it a client-side mistake.
  // Of course, this is only valid in the case of this mock API, as we're purposefully doing it this way.
  res
    .status((typeof err === 'string' ? 400 : 500))
    .send({
      message: `An error occurred! - ${err}`
    });
});

/**
 * LISTENING
 * Initiating the API by listening to the defined port.
 */
app.listen(port, () => {
  console.log(chalk.blue.bold('*** SIMPLE MOCK API ***\r\n'));
  console.log(`Running on port ${chalk.blue(port)}!\r\n`);
});

/**
 * FUNCTIONS
 */

/**
 * Changes or Deletes a record.
 * @param {*} req          The request object.
 * @param {*} res          The response object.
 * @param {boolean} update Should it update or delete?
 */
function changeOrDelete(req, res, update) {
  // An update send its payload through the Body. The deletion uses a simple query, per best practice.
  if ((update && req.body) || (!update && req.query)) {
    // Validating our ID, to see if it's valid. It returns the index of the record.
    let validate = customerFactory.validate(req, (update ? 'body' : 'query'));
    if (validate === -1) {
      throw 'ID was not found!'
    }

    // Splicing array to update or delete the record.
    // We send the second parameter as true, because we want to keep the ID, and not generate a new one.
    let customerEdit = customerFactory.generate(req, true);
    customerEdit.lastupdate = new Date().toISOString();

    // Checking if we should update or delete the record.
    if (update) {
      customerExamples.splice(validate, 1, customerEdit);
    } else {
      customerExamples.splice(validate, 1);
    }

    // Return the record that was updated or deleted.
    res.send(customerEdit);
  } else {
    throw 'Body was not sent!'
  }
}
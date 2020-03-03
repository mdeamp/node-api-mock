/**
 * Customer
 * @typedef {Object} Customer
 * @property {number}  id         Automatically generated id.
 * @property {string}  name       Company name.
 * @property {string}  address    Company address.
 * @property {string}  phone      Company phone number.
 * @property {string}  email      Company email address.
 * @property {string}  lastupdate Last time it was updated (ISO).
 * @property {string}  country    Company country.
 * @property {boolean} active     Is it active?
 * @property {string}  contact    Name of the contact.
 */

/** @type {Array<Customer>} */
var customerExamples = require('../public/customerExamples.json');

module.exports = {
  /**
   * Creates a customer object.
   * @param {*} req          The request object.
   * @param {boolean} keepID Should the factory generate a new ID, or keep the ID from the body object?
   * @returns {Customer}     A new customer object.
   */
  generate: (req, keepID = false) => {
    if (!keepID) {
      // If we should generate a new ID, get the current maximum and add 1.
      req.body.id = Math.max(...customerExamples.map(c => c.id)) + 1;
    } else {
      // Else, we should get the ID from the body (PUT) or the query (DELETE).
      req.body.id = req.body.id || req.query.id;
    }

    return {
      id: parseFloat(req.body.id),
      name: req.body.name || 'No Name',
      address: req.body.address || 'No Address',
      phone: req.body.phone || 'No Phone',
      email: req.body.email || 'No Email',
      lastupdate: req.body.lastupdate || new Date().toISOString(),
      country: req.body.country || 'No Country',
      active: req.body.active || true,
      contact: req.body.contact || 'No Contact',
    }
  },

  /**
   * Validates if the customer sent exists.
   * @param {*} req                 The request object.
   * @param {'body' | 'query'} type Where to look for our ID.
   * @returns {number}              Index of the customer in the collection of customers.
   */
  validate: (req, type) => {
    if (!req[type] || !req[type].id) {
      return -1;
    } else {
      let search = customerExamples.filter(f => f.id.toString() === req[type].id);
      if (search[0]) {
        return customerExamples.indexOf(search[0]);
      } else {
        return -1;
      }
    }
  }
}
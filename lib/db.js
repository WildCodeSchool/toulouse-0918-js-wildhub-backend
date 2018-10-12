const mysql = require('mysql');
const { promisify } = require('util');

// Get DB settings, create connection and promisify query
// const dbSettings = require('./db-settings.json');

// Keep connection alive

module.exports = {

  query: async (...args) => (this.query
    ? this.query(...args)
    : Promise.reject(new Error('Connection not set up'))),

  setup: (settings) => {
    const connection = mysql.createConnection(settings);
    this.query = promisify(connection.query.bind(connection));
    setInterval(() => connection.query('SELECT 1'), 30000);
  },

};

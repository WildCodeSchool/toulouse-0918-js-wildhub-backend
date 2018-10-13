const mysql = require('mysql');
const { promisify } = require('util');

module.exports = {

  query: async (...args) => (this.query
    ? this.query(...args)
    : Promise.reject(new Error('Connection not set up'))),

  setup: (settings) => {
    const connection = mysql.createConnection(settings);
    this.query = promisify(connection.query.bind(connection));
    // Keep connection alive
    setInterval(() => connection.query('SELECT 1'), 30000);
  }

};

const { Pool } = require('pg');

const pool = new Pool({
    user: 'egershte',  // Change this to your PostgreSQL user
    host: 'localhost',
    database: 'gymcrud',
    password: '',  // Your PostgreSQL password, if any
    port: 5432     // Default PostgreSQL port
});

module.exports = pool;

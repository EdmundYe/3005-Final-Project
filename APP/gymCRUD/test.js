const pool = require('./db');
async function test(){
    try {
        // SQL query to select all records from profiles table
        const res = await pool.query('SELECT * FROM schedule');
        console.log('Data:', res.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        // Close the pool to end the session
        pool.end();
    }
}
test();

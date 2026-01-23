require('dotenv').config();
const {Client} = require('pg');

const conn = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: process.env.Postgres_Password,
    database: 'expense-tracker',
});

conn.connect()
    .then(() => {
        console.log('Connected to the database successfully.');  
    })
    .catch((err) => {
        console.error('Database connection error:', err.stack);
    });

module.exports = conn;
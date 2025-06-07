const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Endpoint to create an employee
app.post('/api/employees', async (req, res) => {
  const { name, email, position } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO employees (name, email, position) VALUES (?, ?, ?)',
      [name, email, position]
    );

    // result.insertId gives the new record ID
    res.json({ id: result.insertId, name, email, position });
  } catch (err) {
    console.error('Error inserting employee:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Endpoint to get employee by ID
app.get('/api/employees/:id', async (req, res) => {
  const employeeId = req.params.id;
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM employees WHERE id = ?',
      [employeeId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  port: 3306,
  database: 'auth_system'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// Signup Route
app.post('/signup', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const emailQuery = `SELECT * FROM users WHERE email = ?`;
  db.query(emailQuery, [email], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) throw err;

      const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
      db.query(query, [email, hash], (error) => {
        if (error) throw error;
        res.send('User registered successfully');
      });
    });
  });
});

// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;
  db.query(query, [email], (error, results) => {
    if (error) throw error;

    if (results.length === 0) {
      return res.status(400).send('User not found');
    }

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        res.send('Login successful');
      } else {
        res.status(400).send('Invalid credentials');
      }
    });
  });
});

// Forgot Password Route
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;
  db.query(query, [email], (error, results) => {
    if (error) throw error;

    if (results.length === 0) {
      return res.status(400).send('Email not found');
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiration = Date.now() + 3600000; // 1 hour expiration

    const updateQuery = `UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?`;
    db.query(updateQuery, [token, expiration, email], (err) => {
      if (err) throw err;

      // Simulate sending reset link (in production, send via email)
      res.json({
        message: 'Password reset link has been sent to your email',
        resetLink: `http://localhost:3000/reset-password/${token}`
      });
    });
  });
});

// Reset Password Route
app.post('/reset-password', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], (req, res) => {
  const { token, password } = req.body;

  const tokenQuery = `SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > ?`;
  db.query(tokenQuery, [token, Date.now()], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(400).send('Password reset token is invalid or has expired');
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) throw err;

      const updatePasswordQuery = `UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?`;
      db.query(updatePasswordQuery, [hash, results[0].id], (error) => {
        if (error) throw error;
        res.send('Password has been reset successfully');
      });
    });
  });
});

// Roles

// Fetch Roles
app.get('/roles', (req, res) => {
  const query = `SELECT * FROM roles`;
  db.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// Create Role
app.post('/roles', (req, res) => {
  const { role_name, status } = req.body;
  const query = `INSERT INTO roles (role_name, status) VALUES (?, ?)`;
  db.query(query, [role_name, status], (error) => {
    if (error) throw error;
    res.send('Role added successfully');
  });
});

// Update Role
app.put('/roles/:id', (req, res) => {
  const { id } = req.params;
  const { role_name, status } = req.body;
  const query = `UPDATE roles SET role_name = ?, status = ? WHERE id = ?`;
  db.query(query, [role_name, status, id], (error) => {
    if (error) throw error;
    res.send('Role updated successfully');
  });
});

// Delete Role
app.delete('/roles/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM roles WHERE id = ?`;
  db.query(query, [id], (error) => {
    if (error) throw error;
    res.send('Role deleted successfully');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
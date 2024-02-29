const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

var router = express.Router();
router.use(bodyParser.json());


const db = new sqlite3.Database('contacts.db');

db.serialize(() => {
  // Create a contacts table if not exists
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    firstName TEXT,
    lastName TEXT,
    email TEXT,
    notes TEXT,
    createdAt TEXT,
    lastEdited TEXT
  )`);
});



// home route
router.get('/home', (req, res) => {
  res.render('home',
            {message: "Wellcome using puh"})
})

router.get('/contacts', (req, res) => {
  db.all('SELECT * FROM contacts', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      console.log(rows)
      // Render a Pug template instead of sending JSON
      res.render('contacts', { contacts: rows });
    }
  });
});


// Route to render the edit contact form
router.get('/contacts/edit/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM contacts WHERE id = ?';

  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    // Render the editContact.pug template with the contact data
    res.render('editContact', { contact: row });
  });
});

// route for rendering add contact pug
router.get('/contacts/add', (req, res) => {
  res.render('addContact')
})


// route for adding a contact
router.post('/contacts', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().optional({ nullable: true, checkFalsy: true }).withMessage('Invalid email address'),
  body('notes').optional().isString(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newContact = { 
    ...req.body, 
    id: uuidv4(), 
    createdAt: new Date().toISOString(),
    lastEdited: new Date().toISOString() // Add lastEdited at creation time as well
  };

  try {
    // Insert new contact into the SQLite database
    await db.run(
      `INSERT INTO contacts (id, firstName, lastName, email, notes, createdAt, lastEdited)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [newContact.id, newContact.firstName, newContact.lastName, newContact.email, newContact.notes, newContact.createdAt, newContact.lastEdited]
    );

    // Redirect to the alert with a success message
    res.redirect('/alert?success=Contact%20added%20successfully');
  } catch (error) {
    console.error('Error adding contact:', error);
    res.redirect('/alert?error=Failed%20to%20add%20contact');
  }
});


// route for editing a contact
router.put('/contacts/:id', [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('notes').optional().isString(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const contact = await db.get('SELECT * FROM contacts WHERE id = ?', [req.params.id]);
    if (!contact) {
      return res.status(404).send('Contact not found');
    }

    const updatedContact = { 
      ...contact, 
      ...req.body, 
      lastEdited: new Date().toISOString() // Update lastEdited timestamp
    };

    await db.run(
      `UPDATE contacts 
       SET firstName = ?, lastName = ?, email = ?, notes = ?, lastEdited = ?
       WHERE id = ?`,
      [updatedContact.firstName, updatedContact.lastName, updatedContact.email, updatedContact.notes, updatedContact.lastEdited, req.params.id]
    );

    res.redirect('/alert?success=Contact%20updated%20successfully');
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// route to delete a contact
router.delete('/contacts/:id', async (req, res) => {
  try {
    const contact = await db.get('SELECT * FROM contacts WHERE id = ?', [req.params.id]);
    if (!contact) {
      return res.status(404).send('Contact not found');
    }

    await db.run('DELETE FROM contacts WHERE id = ?', [req.params.id]);

    res.send('Contact deleted successfully');
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});


// Route for the alert
router.get('/alert', (req, res) => {
  // Check if there's a success message in the query parameters
  const successMessage = req.query.success ? req.query.success : '';
  // Check if there's an error message in the query parameters
  const errorMessage = req.query.error ? req.query.error : '';

  // Render the homepage with the success or error message
  res.render('alert', { successMessage, errorMessage });
});


module.exports = router;

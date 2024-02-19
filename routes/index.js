const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

var router = express.Router();
router.use(bodyParser.json());

if (!fs.existsSync('./contacts.json')) {
  fs.writeFileSync('./contacts.json', '[]', 'utf8');
}

router.get('/contacts', (req, res) => {
  const contacts = JSON.parse(fs.readFileSync('contacts.json', 'utf8'));
  res.json(contacts);
});

router.post('/contacts', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().optional({ nullable: true, checkFalsy: true }).withMessage('Invalid email address'),
  body('notes').optional().isString(),
], (req, res) => {
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
  const contacts = JSON.parse(fs.readFileSync('contacts.json', 'utf8'));
  contacts.push(newContact);
  fs.writeFileSync('contacts.json', JSON.stringify(contacts));
  res.json({ message: 'Contact added successfully', contact: newContact });
});


router.put('/contacts/:id', [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('notes').optional().isString(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let contacts = JSON.parse(fs.readFileSync('contacts.json', 'utf8'));
  const index = contacts.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    contacts[index] = { 
      ...contacts[index], 
      ...req.body, 
      lastEdited: new Date().toISOString() // Update lastEdited timestamp
    };
    fs.writeFileSync('contacts.json', JSON.stringify(contacts));
    res.json({ message: 'Contact updated successfully', contact: contacts[index] });
  } else {
    res.status(404).send('Contact not found');
  }
});


/*router.put('/contacts/:id', [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let contacts = JSON.parse(fs.readFileSync('contacts.json', 'utf8'));
  const index = contacts.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...req.body, lastEdited: new Date().toISOString() };
    fs.writeFileSync('contacts.json', JSON.stringify(contacts));
    res.json({ message: 'Contact updated successfully', contact: contacts[index] });
  } else {
    res.status(404).send('Contact not found');
  }
});*/

router.delete('/contacts/:id', (req, res) => {
  let contacts = JSON.parse(fs.readFileSync('contacts.json', 'utf8'));
  const newContacts = contacts.filter(c => c.id !== req.params.id);
  if (contacts.length !== newContacts.length) {
    fs.writeFileSync('contacts.json', JSON.stringify(newContacts));
    res.send('Contact deleted successfully');
  } else {
    res.status(404).send('Contact not found');
  }
});

module.exports = router;

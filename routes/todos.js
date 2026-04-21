const express = require('express');
const router = express.Router();
const Todos = require('../models/Todos');


// Get all todos
router.get('/', async(req, res) => {
    try {
        // Call the find function from a Todos model
        const todos = await Todos.find();
        // Response with the json data
        res.status(200).json({data: todos});
    } catch(err) {
        console.error(err);
        res.status(500).send('Error getting todos');
    }
})
// Get a single todo

// Add a new todo

// Update a todo

// Delete a todo

// Delete all todos

module.exports = router;
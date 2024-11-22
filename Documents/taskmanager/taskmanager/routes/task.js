const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Display all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll({ order: [['createdAt', 'DESC']] });
    res.render('task-list', { tasks });
  } catch (err) {
    res.status(500).send('Error retrieving tasks.');
  }
});

// Render create task page
router.get('/create', (req, res) => {
  res.render('create');
});

// Handle create task form submission
router.post('/create', async (req, res) => {
  try {
    const { title, description, due_date, category } = req.body;
    if (!title.trim()) {
      return res.status(400).send('Task title cannot be empty');
    }
    await Task.create({ title, description, due_date, category });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error creating task.');
  }
});

// Render edit task page
router.get('/edit/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).send('Task not found.');
    }
    res.render('edit', { task });
  } catch (err) {
    res.status(500).send('Error retrieving task for editing.');
  }
});

// Handle edit task form submission
router.post('/edit/:id', async (req, res) => {
  try {
    const { title, description, due_date, category, completed } = req.body;
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).send('Task not found.');
    }
    task.title = title;
    task.description = description;
    task.due_date = due_date;
    task.category = category;
    task.completed = !!completed;
    await task.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error updating task.');
  }
});

// Handle delete task
router.get('/delete/:id', async (req, res) => {
  try {
    await Task.destroy({ where: { id: req.params.id } });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error deleting task.');
  }
});

// Handle mark as completed
router.get('/complete/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).send('Task not found.');
    }
    if (task.completed) {
      return res.status(400).send('Task is already completed.');
    }
    task.completed = true;
    await task.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error marking task as completed.');
  }
});

module.exports = router;

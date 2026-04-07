const mongoose = require('mongoose');
const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ user: req.user.id }, { assignedTo: req.user.id }]
    }).populate('assignedTo', 'name email').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    // Validate assignedTo if provided
    if (assignedTo && !mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({ message: 'Invalid assignedTo user ID' });
    }

    const task = await Task.create({
      user: req.user.id,
      title, description, status, priority, dueDate,
      assignedTo: assignedTo || null,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    // Validate assignedTo if provided in update
    if (req.body.assignedTo && !mongoose.Types.ObjectId.isValid(req.body.assignedTo)) {
      return res.status(400).json({ message: 'Invalid assignedTo user ID' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, $or: [{ user: req.user.id }, { assignedTo: req.user.id }] },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const express = require("express");
const Task = require("../models/taskModel");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Task
router.post("/", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  const task = new Task({ userId: req.user.userId, title, description });
  await task.save();
  res.status(201).json(task);
});

// Get Tasks
router.get("/", authMiddleware, async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const query = {
    userId: req.user.userId,
    deleted: false,
    $or: [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ],
  };

  const tasks = await Task.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json(tasks);
});

// Update Task
router.put("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!task) return res.status(404).json({ message: "Task not found" });

  Object.assign(task, req.body);
  await task.save();
  res.json(task);
});

// Delete Task (Soft Delete)
router.delete("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
  if (!task) return res.status(404).json({ message: "Task not found" });

  task.deleted = true;
  await task.save();
  res.json({ message: "Task deleted" });
});

module.exports = router;

import { Router } from "express";
import {
  retreiveAllTasks,
  retreiveSingleTask,
  updateTask,
  deleteTask,
  createTask,
  retrieveTaskBasedOnStatus,
} from "../controllers/task.controller.js";
const router = Router();

// Retrive all tasks
router.route("/tasks").get(retreiveAllTasks);

// Retrive a single task by id
router.route("/tasks/:id").get(retreiveSingleTask);

// Create a new task
router.route("/tasks").post(createTask);

// Update an existing task by ID.
router.route("/tasks/:id").put(updateTask);

// Delete a task by ID.
router.route("/tasks/:id").delete(deleteTask);

// Filter tasks by status
router.route("/tasks/status/:taskStatus").get(retrieveTaskBasedOnStatus);

export default router;

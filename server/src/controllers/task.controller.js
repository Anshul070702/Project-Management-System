import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignTo, status, dueDate } = req.body;
  console.log("createProject API Called");
  if (
    [title, description, assignTo, status, dueDate].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required!!");
  }
  // Parse dueDate to a Date object
  const parsedDueDate = new Date(dueDate);
  if (isNaN(parsedDueDate)) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Use YYYY-MM-DD." });
  }
  const createdTask = await Task.create({
    title,
    description,
    assignTo: assignTo.toLowerCase(),
    status,
    dueDate: parsedDueDate,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Project added successfully!!", createdTask));
});

const updateTask = asyncHandler(async (req, res) => {
  console.log("UpdateProject API Called");
  const taskId = req.params.id;
  const { title, description, assignTo, status, dueDate } = req.body;
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { title, description, assignTo: assignTo.toLowerCase(), status, dueDate },
    { new: true }
  );
  if (!updatedTask) {
    throw new ApiError(400, "Not able to update task!!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Project updated successfully!!", updatedTask));
});

const deleteTask = asyncHandler(async (req, res) => {
  console.log("deleteProject API Called");
  const taskId = req.params.id;
  const deletedTask = await Task.findByIdAndDelete(taskId);
  if (!deletedTask) {
    throw new ApiError(400, "Not able to delete task!!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Project deleted successfully!!"));
});

const retreiveAllTasks = asyncHandler(async (req, res) => {
  console.log("retreiveAllProject API Called");
  const allTasks = await Task.find();
  return res
    .status(200)
    .json(
      new ApiResponse(200, "All Projects fetched successfully!!", allTasks)
    );
});

const retreiveSingleTask = asyncHandler(async (req, res) => {
  console.log("retreiveSingleProject API Called");
  const taskId = req.params.id;
  const singleTask = await Task.findById(taskId);
  if (!singleTask) {
    throw new ApiError(400, "Project not found!!");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Single project fetched successfully!!", singleTask)
    );
});

const retrieveTaskBasedOnStatus = asyncHandler(async (req, res) => {
  console.log("retrieveProjectsBasedOnStatus API called!");
  const { taskStatus } = req.params;
  // Validate the taskStatus parameter
  const validStatuses = ["pending", "in-progress", "completed"];
  if (!validStatuses.includes(taskStatus)) {
    throw new ApiError(
      400,
      "Status can only be 'pending', 'in-progress', or 'completed'."
    );
  }
  const filteredTasks = await Task.find({ status: taskStatus });

  if (!filteredTasks.length) {
    return res
      .status(404)
      .json(
        new ApiResponse(404, "No tasks found with the specified status.", [])
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Tasks fetched successfully.", filteredTasks));
});
export {
  createTask,
  updateTask,
  deleteTask,
  retreiveAllTasks,
  retreiveSingleTask,
  retrieveTaskBasedOnStatus,
};

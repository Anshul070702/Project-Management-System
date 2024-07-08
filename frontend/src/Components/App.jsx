import React, { useState, useEffect } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  retrieveAllTask,
  createTask,
  deleteTask,
  updateTask,
  retrieveOnStatus,
} from "../Constants/Api";

// Utility function to format date
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

const App = () => {
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [assign, setAssign] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState("pending");
  const [newDueDate, setNewDueDate] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState(-1);
  const [currentEditedItem, setCurrentEditedItem] = useState({});
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    completed: 0,
    pending: 0,
    inProgress: 0,
  });

  useEffect(() => {
    retrieveApiCall();
  }, []);

  const retrieveApiCall = async () => {
    try {
      const response = await fetch(retrieveAllTask, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to retrieve tasks");
      } else {
        const responseData = await response.json();
        console.log("Response data:", responseData);
        setTodos(responseData?.message || []);

        // Calculate status counts
        const counts = responseData.message.reduce(
          (acc, task) => {
            if (task.status === "completed") acc.completed++;
            else if (task.status === "pending") acc.pending++;
            else if (task.status === "in-progress") acc.inProgress++;
            return acc;
          },
          { completed: 0, pending: 0, inProgress: 0 }
        );
        setStatusCounts(counts);
      }
    } catch (error) {
      console.error("Error retrieving tasks:", error);
    }
  };

  const handleAddTodo = async () => {
    const newTodoItem = {
      title: newTitle,
      description: newDescription,
      assignTo: assign,
      status: newStatus,
      dueDate: newDueDate,
    };

    try {
      const response = await fetch(createTask, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodoItem),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      } else {
        const responseData = await response.json();
        console.log(responseData);
        setTodos([...allTodos, responseData.message]);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
    setNewTitle("");
    setNewDescription("");
    setAssign("");
    setNewStatus("pending");
    setNewDueDate("");
  };

  const handleDeleteTodo = async (_id) => {
    try {
      const response = await fetch(deleteTask + _id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      } else {
        const filteredTodo = allTodos.filter((todo) => todo._id !== _id);
        setTodos(filteredTodo);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (index, item) => {
    setCurrentEdit(index);
    setCurrentEditedItem(item);
  };

  const handleUpdateToDo = async () => {
    try {
      const response = await fetch(updateTask + currentEditedItem._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentEditedItem),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      } else {
        const updatedTodos = [...allTodos];
        updatedTodos[currentEdit] = currentEditedItem;
        setTodos(updatedTodos);
        setCurrentEdit(-1);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => ({ ...prev, title: value }));
  };

  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => ({ ...prev, description: value }));
  };

  const handleUpdateAssign = (value) => {
    setCurrentEditedItem((prev) => ({ ...prev, assignTo: value }));
  };

  const handleUpdateStatus = (value) => {
    setCurrentEditedItem((prev) => ({ ...prev, status: value }));
  };

  const handleUpdateDueDate = (value) => {
    setCurrentEditedItem((prev) => ({ ...prev, dueDate: value }));
  };

  const handleFilterTasks = async (status) => {
    try {
      const response = await fetch(`${retrieveOnStatus}${status}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      console.log("Filtered tasks:", responseData);
      setFilteredTodos(responseData?.message || []);
    } catch (error) {
      console.error("Error retrieving tasks:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl text-center mb-8 font-semibold">
        Project Management System
      </h2>
      <div className="grid grid-cols-6 gap-4">
        {/* Left Side - Add New Project Form */}
        <div className="col-span-2 w-full">
          <div className="w-full bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl text-center font-bold mb-4">
              Add New Project
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Name of the Project"
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">
                Description
              </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="About project?"
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Assign To</label>
              <input
                type="text"
                value={assign}
                onChange={(e) => setAssign(e.target.value)}
                placeholder="Name of the Person Assigned"
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In-Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Due Date</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            <button
              onClick={handleAddTodo}
              className="font-bold w-full bg-blue-500 text-white p-2 rounded mt-4"
            >
              Add Project
            </button>
          </div>
        </div>

        {/* Middle Side - Filtered Tasks */}
        <div className="col-span-2 w-full">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-center text-xl font-bold mb-4">
              Project Status
            </h2>
            <div className="w-full flex justify-between items-center">
              <button
                onClick={() => handleFilterTasks("pending")}
                className="h-10 w-32 bg-yellow-500 text-white p-2 rounded mb-2"
              >
                Pending
              </button>
              <button
                onClick={() => handleFilterTasks("in-progress")}
                className="h-10 w-32 bg-orange-500 text-white p-2 rounded mb-2"
              >
                In-Progress
              </button>
              <button
                onClick={() => handleFilterTasks("completed")}
                className="h-10 w-32 bg-green-500 text-white p-2 rounded mb-2"
              >
                Completed
              </button>
            </div>
            <div className="mt-4">
              {filteredTodos.length > 0 ? (
                filteredTodos.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 p-4 rounded-lg shadow-lg mb-4"
                  >
                    {currentEdit === index ? (
                      <div>
                        <input
                          type="text"
                          value={currentEditedItem.title}
                          onChange={(e) => handleUpdateTitle(e.target.value)}
                          placeholder="Name of the Project"
                          className="w-full p-2 rounded bg-gray-600 text-white mb-2"
                        />
                        <input
                          type="text"
                          value={currentEditedItem.description}
                          onChange={(e) =>
                            handleUpdateDescription(e.target.value)
                          }
                          placeholder="About project?"
                          className="w-full p-2 rounded bg-gray-600 text-white mb-2"
                        />
                        <input
                          type="text"
                          value={currentEditedItem.assignTo}
                          onChange={(e) => handleUpdateAssign(e.target.value)}
                          placeholder="Name of the Person Assigned"
                          className="w-full p-2 rounded bg-gray-600 text-white mb-2"
                        />
                        <select
                          value={currentEditedItem.status}
                          onChange={(e) => handleUpdateStatus(e.target.value)}
                          className="w-full p-2 rounded bg-gray-600 text-white mb-2"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In-Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <input
                          type="date"
                          value={currentEditedItem.dueDate}
                          onChange={(e) => handleUpdateDueDate(e.target.value)}
                          className="w-full p-2 rounded bg-gray-600 text-white mb-2"
                        />
                        <button
                          onClick={handleUpdateToDo}
                          className="bg-blue-500 text-white p-2 rounded mt-2"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                        <p className="text-gray-300 mb-2">{item.description}</p>
                        <p className="text-gray-400 mb-2">
                          Assigned to: {item.assignTo}
                        </p>
                        <p className="text-gray-400">
                          Due Date: {formatDate(item.dueDate)}
                        </p>
                        <div className="flex flex-row-reverse mt-2">
                          <button
                            onClick={() => handleDeleteTodo(item._id)}
                            className="bg-red-500 text-white p-2 rounded mr-2"
                          >
                            <AiOutlineDelete />
                          </button>
                          <button
                            onClick={() => handleEdit(index, item)}
                            className="bg-blue-500 text-white p-2 rounded mr-2"
                          >
                            <AiOutlineEdit />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 mx-1">
                  No tasks found.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full col-span-2">
          {/* Right Side - Complete Status */}
          <div className="bg-gray-800 p-6 mx-1 rounded-lg shadow-lg">
            <h2 className="text-center text-xl font-bold mb-4">
              Progress Status
            </h2>
            <div className="flex h-40 w-full mb-8">
              <div className="text-center mx-1">
                <p className="text-gray-400 my-2">Pending</p>
                <CircularProgressbar
                  value={(statusCounts.pending / allTodos.length) * 100}
                  text={`${Math.round(
                    (statusCounts.pending / allTodos.length) * 100
                  )}%`}
                  styles={buildStyles({
                    textColor: "#fbbf24",
                    pathColor: "#fbbf24",
                    trailColor: "#374151",
                  })}
                />
              </div>
              <div className="text-center mx-1">
                <p className="text-gray-400 my-2">In Progress</p>
                <CircularProgressbar
                  value={(statusCounts.inProgress / allTodos.length) * 100}
                  text={`${Math.round(
                    (statusCounts.inProgress / allTodos.length) * 100
                  )}%`}
                  styles={buildStyles({
                    textColor: "#f97316",
                    pathColor: "#f97316",
                    trailColor: "#374151",
                  })}
                />
              </div>
              <div className="text-center mx-1">
                <p className="text-gray-400 my-2">Completed</p>
                <CircularProgressbar
                  value={Math.max(
                    (statusCounts.completed / allTodos.length) * 100,
                    Math.min(
                      0,
                      (statusCounts.completed / allTodos.length) * 100
                    )
                  )}
                  text={`${Math.max(
                    Math.round((statusCounts.completed / allTodos.length) * 100)
                  )}%`}
                  styles={buildStyles({
                    textColor: "#34d399",
                    pathColor: "#34d399",
                    trailColor: "#374151",
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

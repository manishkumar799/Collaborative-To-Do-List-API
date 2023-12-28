const Task = require("../model/Task");
const mongoose = require("mongoose");

exports.createTask = async (ownerId, taskData,io) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return { staus: 500, error: "Invalid ID" };
    }
    const newTask = new Task({ owner: ownerId, ...taskData });
    await newTask.save();
    io.emit("chat message", `${newTask.title} is created by owner:${ownerId}`);
    return { status: 200, msg: "Task saved successfully" };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

exports.allTask = async (ownerId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return { staus: 500, error: "Invalid ID" };
    }
    const tasks = await Task.find({ owner: ownerId });
    if (tasks.length == 0) {
      return { status: 404, msg: "Not task found" };
    }

    const modifiedTasks = tasks.map((task) => {
      const {
        _id,
        title,
        description,
        dueData,
        completed,
        owner,
        collaborators,
      } = task;
      return {
        TaskId: _id,
        title: title,
        description: description,
        dueData: dueData,
        completed: completed,
        owner: owner,
        collaborators: collaborators,
      };
    });
    return { status: 200, tasks: modifiedTasks };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

exports.allTaskCollaborator = async (collaboratorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(collaboratorId)) {
      return { staus: 500, error: "Invalid ID" };
    }
    const tasks = await Task.find({ collaborators: collaboratorId });
    if (tasks.length == 0) {
      return { status: 404, msg: "Not task found" };
    }
    const modifiedTasks = tasks.map((task) => {
      const {
        _id,
        title,
        description,
        dueDate,
        completed,
        owner,
        collaborators,
      } = task;
      return {
        TaskId: _id,
        title: title,
        description: description,
        dueDate: dueDate,
        completed: completed,
        owner: owner,
        collaborators: collaborators,
      };
    });

    return { status: 200, tasks: modifiedTasks };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

exports.updateTaskByOwner = async (ownerId, taskId, updatedData, io) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(ownerId) ||
      !mongoose.Types.ObjectId.isValid(taskId)
    ) {
      return { staus: 500, error: "Invalid ID" };
    }
    const task = await Task.findOne({ _id: taskId, owner: ownerId });

    if (!task) {
      return {
        status: 404,
        msg: "Task not found or does not belong to the owner",
      };
    }
    Object.assign(task, updatedData);
    await task.save();
    io.emit("chat message", `${task.title} is updated by Owner:${task.owner}`);
    return { status: 200, msg: "Task updated successfully" };
  } catch (error) {
    throw error;
  }
};
exports.deleteTaskByOwner = async (ownerId, taskId) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(ownerId) ||
      !mongoose.Types.ObjectId.isValid(taskId)
    ) {
      return { staus: 500, error: "Invalid ID" };
    }
    const task = await Task.findOne({ _id: taskId, owner: ownerId });

    if (!task) {
      return {
        staus: 404,
        msg: "Task not found or does not belong to the owner",
      };
    }
    await task.deleteOne();
    return { status: 200, msg: "Task deleted successfully" };
  } catch (error) {
    throw error;
  }
};

exports.updateTaskByCollaborator = async (
  collaboratorId,
  taskId,
  updatedData,
  io
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(collaboratorId) ||
      !mongoose.Types.ObjectId.isValid(taskId)
    ) {
      return { staus: 500, error: "Invalid ID" };
    }
    const tasks = await Task.find({ collaborators: collaboratorId });
    const taskToUpdate = tasks.find((task) => task._id.toString() === taskId);
    if (!taskToUpdate) {
      return {
        staus: 404,
        msg: "Task not found or collaborator is not assigned to the task",
      };
    }
    if (typeof updatedData.completed != "boolean") {
      return { status: 500, error: "Invalid Data Type" };
    }

    if (taskToUpdate.completed == updatedData.completed) {
      return { status: 200, msg: "No Changes were made" };
    }

    taskToUpdate.completed = updatedData.completed;
    const updatedTask = await taskToUpdate.save();
    io.emit("chat message", `${taskToUpdate.title} is updated by collaborator:${collaboratorId}`);

    return { status: 200, msg: "Task updated successfully" };
  } catch (error) {
    throw error;
  }
};

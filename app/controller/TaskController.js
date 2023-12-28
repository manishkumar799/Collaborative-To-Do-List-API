const TaskService = require("../service/TaskServices");

exports.createTask = async (req, res) => {
  try {
    const ownerId = req.params.userId;
    const taskData = req.body;
    const createdTask = await TaskService.createTask(ownerId, taskData,req.io);
    res.json(createdTask);
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

exports.updateTaskByOwner = async (req, res) => {
  try {
    const ownerId = req.params.userId;
    const taskId = req.params.taskId;
    const updatedData = req.body;

    const updatedTask = await TaskService.updateTaskByOwner(
      ownerId,
      taskId,
      updatedData,
      req.io
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.allTask = async (req, res) => {
  try {
    const ownerId = req.params.userId;
    const taskData = await TaskService.allTask(ownerId);
    res.json(taskData);
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

exports.deleteTaskByOwner = async (req, res) => {
  try {
    const ownerId = req.params.userId;
    const taskId = req.params.taskId;
    const deletedTask = await TaskService.deleteTaskByOwner(ownerId, taskId);
    res.json(deletedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskByTaskId = async (req, res) => {};

exports.allTaskCollaborator = async (req, res) => {
 
  try {
    const collaboratorId = req.params.collaboratorId;
    const tasks = await TaskService.allTaskCollaborator(collaboratorId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ status: 500, error: error.msg });
  }
};
exports.updateTaskByCollaborator = async (req, res) => {
  try {
    const { collaboratorId, taskId } = req.params;
    const taskData = req.body;
    const tasks = await TaskService.updateTaskByCollaborator(collaboratorId,taskId,taskData,req.io);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ status: 500, error: error.msg });
  }
};

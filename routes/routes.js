const express = require("express");
const VerifyToken = require('./../app/middlewere/VerifyToken');
const UserController = require("../app/controller/UserController");
const TaskController = require("../app/controller/TaskController");

const router = express.Router();
router.post("/register", UserController.signUp);
router.post("/login", UserController.signIn);

router.get('/users',VerifyToken.verifyToken, UserController.getAllUsers)

router.post('/task/:userId',VerifyToken.verifyToken, TaskController.createTask)
router.get('/task/:userId',VerifyToken.verifyToken, TaskController.allTask);
router.get('/tasks/collaborator/:collaboratorId',VerifyToken.verifyToken, TaskController.allTaskCollaborator);

router.delete('/task/:userId/:taskId',VerifyToken.verifyToken, TaskController.deleteTaskByOwner);
router.put('/task/:userId/:taskId',VerifyToken.verifyToken, TaskController.updateTaskByOwner);
router.put('/task/collaborator/:collaboratorId/:taskId',VerifyToken.verifyToken, TaskController.updateTaskByCollaborator);


module.exports = router;

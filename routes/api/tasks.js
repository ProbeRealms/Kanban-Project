const express = require('express');
const router = express.Router();
const tasksController = require('../../controllers/tasksController');

router.route('/')
    .get(tasksController.getAllTasks)
    .post(tasksController.createNewTask)
    .put(tasksController.updateTask)
    .delete(tasksController.deleteTask);

router.route('/:id')
    .get(tasksController.getTask);

module.exports = router;
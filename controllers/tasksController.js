const Task = require('../model/Task');

const getAllTasks = async (req, res) => {
    const tasks = await Task.find();
    if(!tasks) return res.status(204).json({'message' : 'No Tasks Found!'});
    res.json(tasks);
}

const createNewTask = async (req, res) => {

    if(!req?.body?.title){
        return res.status(400).json({ 'message' : 'A title is required!'});
    }

    try{
        const result = await Task.create({
            title: req.body.title,
            status: req.body.status,
            tag: req.body.tag
            // firstname: req.body.firstname,
            // lastname: req.body.lastname
        });
        
        res.status(201).json(result);
    }catch (err){
        console.error(err);
    }

}

const updateTask = async (req, res) => {
    if(!req?.body?.id){
        return res.status(400).json({'message': 'ID Parameter is required.'});
    }

    const task = await Task.findOne({ _id: req.body.id }).exec();
    if(!task) {
        return res.status(204).json({"message" : `Task ID ${req.body.id} not found`});
    }

    // Update fields if they are sent
    if (req.body?.title) task.title = req.body.title;
    if (req.body?.status) task.status = req.body.status; // Useful for moving columns!
    if (req.body?.tag) task.tag = req.body.tag;

    const result = await task.save();
    res.json(result);
}

const deleteTask = async (req, res) => {
    if(!req?.body?.id) return res.status(400).json({'message': 'Task ID required!'});

    const task = await Task.findOne({ _id: req.body.id }).exec();
    if(!task) {
        return res.status(204).json({"message" : `Task ID ${req.body.id} not found`});
    }
    
    const result = await task.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getTask = async (req, res) => {
    if(!req?.params?.id) return res.status(400).json({'message': 'Task ID required!'});
 
    const task = await Task.findOne({ _id: req.params.id }).exec();
    if(!task) {
        return res.status(204).json({"message" : `Task ID ${req.params.id} not found`});
    }
    res.json(task);
}

module.exports = {
    getAllTasks,
    createNewTask,
    updateTask,
    deleteTask,
    getTask
}
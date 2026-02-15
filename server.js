require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

const cors = require('cors');
const credentials = require('./middleware/credentials')
const corsOptions = require('./config/corsOptions');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorhandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// Connect to mongoDB
connectDB();

// custom middleware logger
app.use(logger);

app.use(credentials);

// Cross Origin resource share.
app.use(cors(corsOptions));

// built in form data middleware 
app.use(express.urlencoded({extended : false}))

// built in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// // Add this simple test route
// app.get('/api/test', (req, res) => {
//     res.json({ message: "Connection successful! Backend is talking to Frontend." });
// });

// mongodb+srv://muhammadalee2006_db_user:<db_password>@cluster0.bemhqo6.mongodb.net/?appName=Cluster0


app.use(verifyJWT);
app.use('/tasks', require('./routes/api/tasks'));
app.use('/employees', require('./routes/api/employees'));


app.all(/.*/, (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }else if(req.accepts('json')){
        res.json({error: "404 Not Found"});
    }else{
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

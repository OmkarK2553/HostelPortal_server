const dotenv = require('dotenv')
const mongoose = require('mongoose')
const express = require('express')
const app = express();
const cors = require('cors');

dotenv.config({ path: './config.env' })
require('./db/conn')
app.use(cors({
    origin: '*'
}));
app.use(express.json());        // to convert data in form of json

// const User = require('./model/userSchema')

// gettings the routes
app.use(require('./router/auth'))

const PORT = process.env.PORT


app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
})
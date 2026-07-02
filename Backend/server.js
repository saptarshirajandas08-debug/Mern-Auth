require('dotenv').config();
const express = require('express');
const {dbConnection} = require('./database/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cookieParser());
app.use(cors({credentials: true}));

app.get('/', (req, res)=> {
    res.send("Api is working");
})

const PORT = process.env.PORT || 3000;
dbConnection();

app.listen(PORT, ()=>{
    console.log(`Server started at ${PORT}`);
})
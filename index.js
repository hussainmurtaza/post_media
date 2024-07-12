require('dotenv').config();
const express = require('express');
const authenticationRoute = require('./route/authentication.route')
const postRoute = require('./route/post.route')
const connectDB = require('./database/config')
const app = express();

const port = process.env.PORT || 5000

app.use(express.json());

// connect mongoDB
connectDB()

// authentication route
app.use('/', authenticationRoute)

// post route
app.use('/post', postRoute)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
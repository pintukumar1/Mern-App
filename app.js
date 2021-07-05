const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose')
const schema = require('./schema/schema')
require('dotenv').config()
const path = require('path')

const app = express()

//allow cross sharing of resources
app.use(cors())

const port = process.env.PORT || 8080

//connect to mongodb
mongoose.connect(process.env.mongodbUri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true ,
    useCreateIndex:  true})
    
//check the mongodb connection
mongoose.connection.once('open', () => console.log('Connected to database'))

//use graphql as middleware
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*',(req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

//listen for the request
app.listen(port, () => console.log(`Server is up at port ${port}`))
we get something by using 'require'

const express = require('express')

const app = express() //because the const epxress gives us a func so we are calling it


for routes
-----------
app.get('our path' , a callback(request , response) {
    response.send('path 1')
})

middleware
-----------
before going to the routes after getting a request we want to do something then we 
want our routes so in this case we use middleware

app.use(callback(request , response , next) {
    console.log("middleware running')
    next() // here we are telling it to go to routes
})

tips: app.use() run it again and again app.get() means if that is the route then run this


error handling
---------------

if we want to handle error in a specific route then we must include 'next' param

app.get('/about' , (req , res, next)=>{
    return next(new Error('not implemented yet)) //we have to return the error it will show
                                                    in the console
})

we need to use the error handling at the end like below:

app.use((err , req , res , next)=>{
    console.log(err.stack)
    res.status(500).send('something broke') // this msg whill show at the frontend
})

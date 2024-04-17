const express = require('express')
const app = express();

//routes create
//app.get('route path' , requestHandler(){})


//middleware - if we want to do something after getting the request then go to route
app.use(function (req, res, next) {
    console.log('middleware running');
    next() //telling it to move the request forward
})

app.use(function (req, res, next) {
    console.log('middleware running again');
    next()
})

app.get("/", function (req, res) {
    res.send('Champion meeeee')
})

app.get("/profile", function (req, res) {
    res.send("this is profile")
})

app.get('/about', (req, res, next) => {
    return next(new Error('not implemented yet'))
})

//we must include next in the routes where we want to handle the error


//error handling - use this at the end always
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('something broke')
})

app.listen(3000)
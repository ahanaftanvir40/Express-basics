const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cookieParser()) // to read the cookie

app.get('/', (req, res) => {

    let token = jwt.sign({ email: 'ahanaf.tanvir40@gmail.com' }, 'secret') // here we are using an email as cookie and the 'secret' is a special key that we hide
    //if anyone have this key they can easily hack the data
    console.log(token);
    res.cookie("token", token) // to set cookie we use res
    res.send('hello')

})


app.get('/read', (req, res) => {
    let data = jwt.verify(req.cookies.token, 'secret') // we are reading the encrypted cookie and it must needs that key
    console.log(data);
    console.log(req.cookies); //to read the cookie we use req
    res.send('read')
})


app.get('/encryption', (req, res) => {
    bcrypt.genSalt(10, function (err, salt) { //we usually set saltRounds to 10 
        //salt is random generated string
        bcrypt.hash('thisispassword', salt, function (err, hash) { //hashing the pass
            console.log(hash);
        });
    });
})

app.get('/checkhash', (req, res) => {
    bcrypt.compare('thisispassword', '$2b$10$vzEbB1bavVdfGkO1AHrbjew/dG/s3p3IM3QsTkTVwdo.YH0ONPWwS', function (err, result) {
        console.log(result); //logs true
    });

})

app.listen(3000, () => {
    console.log('server up');
})
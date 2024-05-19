const express = require('express')
const app = express()
const cookieParser = require("cookie-parser")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('./models/user')
const postModel = require('./models/post')

app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.get('/', (req, res) => {
    res.render('index')
})

app.get('/profile', isLoggedIn, (req, res) => {
    res.send(req.user);
})

app.post('/create', (req, res) => {
    let { name, username, password, email, age } = req.body
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.findOne({ email: email })
            if (user) {
                res.status(500).send('user already registered')
            } else {
                let user = await userModel.create({
                    name: name,
                    username: username,
                    email: email,
                    password: hash,
                    age: age
                })
                let token = jwt.sign({ email: email, userid: user._id }, 'secretkey')
                res.cookie('token', token)
                res.send(user)
            }
        })
    })
})



app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    let { username, email, password } = req.body
    let user = await userModel.findOne({ email: email })
    if (!user) {
        res.send('something is wrong')
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (result == true) {
            let token = jwt.sign({ email: email, userid: user.id }, 'secretkey')
            res.cookie('token', token)
            res.status(200).send('Logged in')
        } else {
            res.redirect('/login')
        }
    })
})
app.get('/logout', (req, res) => {
    res.cookie('token', '')
    res.redirect('/login')
})

function isLoggedIn(req, res, next) {
    if (req.cookies.token === '') {
        res.send('You must be logged in')
    } else {
        let data = jwt.verify(req.cookies.token, 'secretkey')
        req.user = data
        next()
    }
}

app.listen(3000, () => {
    console.log('server up');
})
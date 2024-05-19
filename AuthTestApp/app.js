const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()
const path = require('path')
const userModel = require('./models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())


app.get('/', (req, res) => {
    res.render('index')
})

app.post('/create', async (req, res) => {
    let { username, email, password, age } = req.body

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                username: username,
                email: email,
                password: hash,
                age: age
            })

            let token = jwt.sign({ email: email }, 'secretkey')
            res.cookie('token', token)
            res.send(user)
        })
    })
})

app.get('/logout', (req, res) => {
    res.cookie('token', '')
    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    let user = await userModel.findOne({ email: req.body.email })
    if (!user) {
        res.send('something is wrong')
    } else {
        bcrypt.compare(req.body.password, user.password, function (err, result) {
            if (result == true) {
                let token = jwt.sign({ email: user.email }, 'secretkey')
                res.cookie('token', token)
                res.send('you are logged in')
            } else {
                res.send('something went wrong')
            }
        });
    }
})




app.listen(3000, () => {
    console.log('server up');
})
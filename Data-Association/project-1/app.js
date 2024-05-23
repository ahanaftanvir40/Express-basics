const express = require('express')
const app = express()
const cookieParser = require("cookie-parser")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('./models/user')
const postModel = require('./models/post')
const path = require('path')
const multerconfig = require('./config/multerconfig')
const upload = require('./config/multerconfig')


app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())





app.get('/', (req, res) => {
    res.render('index')
})

app.get('/profile', isLoggedIn, async (req, res) => {

    let user = await userModel.findOne({ email: req.user.email }).populate('posts')

    res.render('profile', { user: user });
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
            res.status(200).redirect('/profile')
        } else {
            res.redirect('/login')
        }
    })
})
app.get('/logout', (req, res) => {
    res.cookie('token', '')
    res.redirect('/login')
})

app.post('/post', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email })
    let { content } = req.body
    let post = await postModel.create({
        user: user._id,
        content: content
    })
    user.posts.push(post._id)
    await user.save()
    res.redirect('./profile')
})


app.get('/like/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate('user')

    if (post.likes.indexOf(req.user.userid) === -1) { //if that person is not in the array
        post.likes.push(req.user.userid) //increase like 

    } else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1) //delete this user
    }


    await post.save()
    res.redirect('/profile')
})

app.get('/edit/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate('user')

    res.render('edit', { post: post })
})

app.post('/update/:id', async (req, res) => {
    let post = await postModel.findOneAndUpdate({ _id: req.params.id }, { content: req.body.content })
    res.redirect('/profile')
})

app.get('/changeprofile', isLoggedIn, (req, res) => {

    res.render('changeprofile')
})

app.post('/upload', isLoggedIn, upload.single('image'), async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email })

    user.profilepic = req.file.filename
    await user.save()
    res.redirect('/profile')

})




function isLoggedIn(req, res, next) {
    if (req.cookies.token === '') {
        res.redirect('/login')
    } else {
        let data = jwt.verify(req.cookies.token, 'secretkey')
        req.user = data
        next()
    }
}




app.listen(3000, () => {
    console.log('server up');
})
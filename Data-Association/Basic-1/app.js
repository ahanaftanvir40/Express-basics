const express = require('express')
const app = express()
const path = require('path')
const userModel = require('./models/user')
const postModel = require('./models/post')


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.send('hey')
})

app.get('/create/user', async (req, res) => {
    let user = await userModel.create({
        username: 'Ahanaf',
        email: 'ahanaf@gmail.com',
        age: 24
    })
    res.send(user)
})

app.get('/create/post', async (req, res) => {
    let post = await postModel.create({
        postdata: 'hello everyone',
        user: "664896a9c06239c2698414ff"
    })

    let user = await userModel.findOne({ _id: "664896a9c06239c2698414ff" })
    user.posts.push(post._id)
    await user.save()

    res.send({ post, user })
})

app.listen(3000, () => {
    console.log('server up');
})
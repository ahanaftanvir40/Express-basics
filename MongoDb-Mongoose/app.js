const express = require('express')
const app = express()


const userModel = require('./userModel')



app.get('/', (req, res) => {
    res.send('home page up')

})

//CRUD Basics
app.get('/create', async (req, res) => {

    const createUser = await userModel.create({
        name: 'Ahanaf1',
        username: 'Ahanaf123',
        email: 'ahanaf.tanvir@gmail.com'
    })
    res.send(createUser)
})

app.get('/read', async (req, res) => {
    const Singleuser = await userModel.find({ username: 'Ahanaf123' }) //returns a list of the matched user
    //const user = await userModel.findOne({username : 'Ahanaf'}) //returns the first match and returns a object
    const user = await userModel.find()
    res.send(user)
})

app.get('/update', async (req, res) => {
    const updatedUser = await userModel.findOneAndUpdate({ name: 'Ahanaf' }, { username: 'Ahanaf1337' }, { new: true })
    res.send(updatedUser)
})

app.get('/delete', async (req, res) => {
    const user = await userModel.findOneAndDelete({ username: 'Ahanaf' })
    res.send(user)
})




app.listen(3000, () => {
    console.log('server running');
})
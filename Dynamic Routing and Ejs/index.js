const epxress = require('express')
const app = epxress()

const path = require('path')

//setting up parsers for form
app.use(epxress.json())
app.use(epxress.urlencoded({ extended: true }))
app.use(epxress.static(path.join(__dirname, 'public'))) //for finding static files in public folder
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('index')
})
app.get('/profile/:username', function (req, res) {
    res.send(`Welcome , ${req.params.username}`)
})


app.listen(3000, function () {
    console.log('server running');
})
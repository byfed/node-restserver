require('./config/config');

const express = require('express')
const mongoose = require('mongoose');
const colors = require('colors');

const bodyParser = require('body-parser')
const { urlencoded } = require('express')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//Importacion de rutas
app.use(require('./routes/usuario'));

//Se mueven las rutas del usuario a server/routes/usuario.js
// app.get('/usuario', function(req, res) {
//     res.json('get Usuario Local')
// })

// app.post('/usuario', function(req, res) {

//     let body = req.body;

//     if (body.nombre === undefined) {
//         res.status(400).json({
//             ok: false,
//             mensaje: 'El nombre es necesario'
//         })
//     } else {
//         res.json({
//             persona: body
//         })

//     }

// })

// app.put('/usuario/:id', function(req, res) {

//     let id = req.params.id;

//     res.json({
//         id
//     })
// })

// app.delete('/usuario', function(req, res) {
//     res.json('delete Usuario')
// })

mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((resp) => { console.log('Connected to Mongo!!'.green); })
    .catch((error) => { console.log('Error connecting to Mongo'.red, error); });


app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto ", process.env.PORT);
})
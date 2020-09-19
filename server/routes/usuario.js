const express = require('express')
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express()


//obtiene coleccion de usuarios de <limite> cantidad de usuarios tomados a partir del índice <desde>
app.get('/usuario', function(req, res) {
    //res.json('get Usuario Local')

    let desde = req.query.desde || 0;
    desde = Number(desde);


    let limite = req.query.limite || 5;
    limite = Number(limite)

    //find -> primer argumento: condicion. -> segundo argumento: lista de campos que se mostrarán
    //Solo queremos recuperar los usuarios con estado a true
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            //Método que ya viene construido con cualquier modelo
            //Solo contamos los usuarios con estado true para implementar el soft delete
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    totalRegistrosEnColeccion: conteo,
                    usuarios
                })

            })

        })
})

app.post('/usuario', function(req, res) {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //para no devolver el hash al usuario
        //usuarioDB.password = null;
        //Aunque se ha hecho de forma más elegante usando el methos.toJSON del esquema y se elimina al devolver el usuario a un json

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    //let body = req.body;
    //Con pick seleccionamos todas las variables que SI se pueden actualizar
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'estado', 'role']);

    //Una forma básica de eliminar campos del body para evitar que se actualicen
    //delete body.password;
    //delete body.google;
    //Pero si son muchas propiedades, se puede hacer pesado. Usamos la función pick de underscore

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                //body,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    //Eliminación física de la base de datos
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            })

        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })

})

//borrado suave
app.delete('/usuario/soft/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'estado', 'role']);
    body.estado = false;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                //body,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})

//solucion tutor para borrado suave
app.delete('/usuario/soft2/:id', function(req, res) {

    let id = req.params.id;

    let cambiarEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                //body,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})



module.exports = app;
const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//validación con google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                //body,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                message: '(Usuario) y/o contraseña incorrecta'
            })
        }

        //Encripta un texto y compara los valores encriptados
        console.log(body.password);
        console.log(bcrypt.hashSync(body.password, 10));
        console.log(usuarioDB.password);
        console.log(bcrypt.compareSync(body.password, usuarioDB.password));
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                message: 'Usuario y/o (contraseña) incorrecta'
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN })

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    })

})


//CONFIGURACIONES DE GOOGLE
//una función async regresa una promoresa

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log("payload..............");
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch((err) => {
            return res.status(403).json({
                ok: false,
                err
            })
        })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        //Si existe un usuario "normal" en la base de datos, no debería poder autenticarse como google (google: false)

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticación normal'
                    }
                })

            } else {
                //Se calcula un nuevo token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN })

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            //Si es la primera vez que accede a traves de google (no existe el usuario en la base de datos)
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre,
                usuario.email = googleUser.email,
                usuario.img = googleUser.img,
                //El campo usuario es requerido, aunque no va a ser posible usar ese password para validarse, porque el usuario será de tipo google
                usuario.password = ':-)'
            usuario.google = true

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN })

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            })
        }

    })

});


module.exports = app;
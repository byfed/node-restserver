const jwt = require('jsonwebtoken');


// Verificacion de token

let verificaToken = (req, res, next) => {

    //porar recuperar el header de la peticion
    let token = req.get('token');

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Autentication failed!. invalid token',
                err
            })
        }

        req.usuario = decoded.usuario; //recupera el payload
        next(); //Continua la ejecución
    });
}

//Middlewere para verificar el rol de usuario
let verificaAdmin_role = (req, res, next) => {

    let usuario = req.usuario;
    let role = usuario.role;

    if (role != "ADMIN_ROLE") {
        return res.status(300).json({
            ok: false,
            message: 'Role no válido para esta operación',
        })
    }
    next();
}


module.exports = {
        verificaToken,
        verificaAdmin_role
    }
    /*
    también se podría exportar haciendo module.exports.verificaToken en la definición
    */
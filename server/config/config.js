// Configuración del puerto

process.env.PORT = process.env.PORT || 3000;

//configuración del entorno
//si no existe la variable estamos en en desarrollo. Si existe estamos en producción
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//base de datos
let urlDB;

//process.env.NODE_ENV = 'nodev';
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://byfed:20200803@cluster0.m8cal.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
// Configuración del puerto

process.env.PORT = process.env.PORT || 3000;

//configuración del entorno
//si no existe la variable estamos en en desarrollo. Si existe estamos en producción
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//gestión del token
//fecha de vencimiento: 
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'este-es-el-seed-desarrollo';



//base de datos
let urlDB;

//process.env.NODE_ENV = 'nodev';
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.mongo_url;
}

process.env.URLDB = urlDB;
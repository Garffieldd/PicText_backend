const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const dbconnect = async () => {
    mongoose.connect("mongodb+srv://root:univalle@cluster0.pe6nq66.mongodb.net/pictext_db",{})
    .then(() =>{
        console.log("Conexion exitosa")
    })
    .catch(() => {
        console.log("La conexion fallo")
    })
    
 }
        
cloudinary.config({
    cloud_name: 'vikingr-saga',
    api_key: '921911162195225',
    api_secret: 'KfcpJunBPHoteDsGprn6sN5m4gY'
});    

module.exports = dbconnect;
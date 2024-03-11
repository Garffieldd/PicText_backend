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
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});    

module.exports = dbconnect;
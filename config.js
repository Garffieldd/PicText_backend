const mongoose = require('mongoose');
const dbconnect = async () => {
    mongoose.connect("mongodb+srv://root:univalle@cluster0.pe6nq66.mongodb.net/pictext_db",{})
    .then(() =>{
        console.log("Conexion exitosa")
    })
    .catch(() => {
        console.log("La conexion fallo")
    })
    
 }
        
     

module.exports = dbconnect;
const express = require('express');
const dbconnect = require('./config'); 
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const ModelUser = require('./userModel');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const cors = require('cors');

dotenv.config();
const app = express();
const router = express.Router();

// Configuración de Google Generative AI    
const api_key = "AIzaSyBKrGdMD8ebtiYMcYGuEGzIx2Ij89_ToTI";
const genAI = new GoogleGenerativeAI(api_key);
const generationConfig = { temperature: 0.4, topP: 1, topK: 32, maxOutputTokens: 4096 };
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision", generationConfig });

// FUNTION TO GET THE MINE TYPE OF AN IMAGE
function getMimeType(filePath) {
    const extensionToMimeType = {
      png: "image/png",
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      webp: "image/webp",
      heic: "image/heic",
      heif: "image/heif"
    };
    const extension = filePath.split('.').pop().toLowerCase();
    return extensionToMimeType[extension] || 'application/octet-stream'; 
  }


  app.use(cors())
//GEMINI IMAGE Promts

router.post("/response", async (req, res) => {
  try {
    let textToUse = "Escribe todo el texto que aparece en la imagen:\n";

    if (req.body.text && req.body.text.trim() !== "") {
        textToUse = req.body.text.trim();
    }

    // Descargar la imagen desde la URL de Cloudinary
    const cloudinaryUrl = req.body.imagePath;
    const response = await axios.get(cloudinaryUrl, { responseType: 'arraybuffer' });
    const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');
    const mimeType = getMimeType(cloudinaryUrl);
    console.log("hola", cloudinaryUrl);

    // Definir las partes para la generación de contenido
    const parts = [
        { text: textToUse },
        {
            inlineData: {
                mimeType: mimeType,
                data: imageBase64 // Usar la imagen en formato base64
            }
        },
    ];

    // Generar contenido utilizando tanto la entrada de texto como de imagen
    console.log("hola",textToUse)
    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    const responses = await result.response;
    const generatedText = responses.text();
    console.log("Generated Text:", generatedText);
    res.json({ generatedText }); // Enviar el texto obtenido como respuesta
  } catch (error) {
    console.error('Error al obtener respuesta:', error);
    res.status(500).send("Error al obtener respuesta");
  }
});


//ACTUALIZAR LAS CONSULTAS DEL USUARIO

router.put("/actualizar/:id", async (req,res) => {
    const new_record = req.body; //ESTE BODY DEBERIA ACTUALIZAR EL ARREGLO "record" para añadir las consultas que se van haciendo cada vez que se descarga un pdf
    const id = req.params.id;
    const response = await ModelUser.findOneAndUpdate({_id: id},new_record)
    res.send(response)
})

// CREAR UN USUARIO

router.post("/register", async (req, res) => {
    try {
      const { name, email, password, record } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await ModelUser.create({
        name,
        email,
        password: hashedPassword,
        record
      });

      

      res.status(201).json({ message: "Usuario creado con éxito.", user: newUser });
    } catch (error) {
      console.error('Error al registrar nuevo usuario:', error);
      res.status(500).json({ message: "Error al registrar nuev  o usuario." });
    }
  });

// OBTENER TODOS LOS USUARIOS
router.get("/all", async (req,res) => {
    const response = await ModelUser.find({})
    res.send(response)
})

// OBTENER UN USUARIO
router.get("/one/:id", async (req,res) =>{
    const id = req.params.id
    const response = await ModelUser.findById(id)
    res.send(response)
})

//VERIFICAR LOGIN 

router.post('/login', async (req, res) => {
    try {
      // Buscar al usuario por correo en la base de datos MongoDB
      const email_req = req.body.email
      const user = await ModelUser.findOne({ email:email_req });
      console.log(user)
      if (user) {
        // Verificar la contraseña
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  
        if (passwordMatch) {
          // El inicio de sesión es exitoso
          res.json({
            acceso: true,
            message: "Entró",
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
            }
          });
        } else {
          // Contraseña incorrecta
          res.status(400).send({ acceso: false, message: "Contraseña incorrecta" });
        }
      } else {
        // Usuario no encontrado
        res.status(400).send({ message: "Correo incorrecto" });
      }
    } catch (err) {
      console.error('Error al realizar la consulta en MongoDB', err);
      res.status(400).send("Error al ingresar");
    }
  });

app.use(express.json())
app.use(router)


app.listen(3001,() => {
    console.log("hola")
})

dbconnect();
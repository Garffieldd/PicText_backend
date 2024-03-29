const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        record: [
            {
                image: {
                    type: String
                },
                text: {
                    type: String
                }
            }
        ]
    },
    {
        timestamps:true,
        versionKey:false,
    }
    )

    const ModelUser = mongoose.model("usuarios",userSchema)
    module.exports = ModelUser;


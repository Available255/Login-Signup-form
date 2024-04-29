const mongoose=require("mongoose");
const path = require("path");
const loginSchema = require("./config");
const connect =mongoose.connect("mongodb://localhost:27017/dbUsers");

//check database connected or not
connect.then(() =>{
    console.log("Database connected Successfully");

    
})
.catch((error) => {
    console.log("Databse can't be connected");
    console.error(error);
});

const LoginSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
        email: {
        type: String,
        required:true,
        unique: true, 
    },
    password: {
        type:String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: true,
    },

});

const collection =  mongoose.model("mongodb", LoginSchema);
module.exports = collection;



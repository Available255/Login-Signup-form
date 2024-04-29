const express =require("express");
const path = require("path");
const collection = require("./config");
const bcrypt =require("bcrypt");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const Recaptcha = require("express-recaptcha").RecaptchaV2;



const app = express();

const recaptcha= new Recaptcha("6LdChEIpAAAAAPiT9dFOpM07d0_xqeLvtYvxrrtw","6LdChEIpAAAAACgtHzaeVbNBK7nwhCc2DF2njpfM");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


// Define route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.get("/login", (req,res)=>{
    res.render("login");
});

app.get("/signup", (req,res)=>{
    res.render("signup");
});

app.post("/login", async(req,res)=>{

    const data = {
        email: req.body.email,
        password: req.body.password,
    };
    try {
        // Find the user in the database based on the provided email
        const user = await collection.findOne({ email: data.email });

        // Check if the user exists
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Check if the password matches
        if (user.password !== data.password) {
            return res.status(401).send("Incorrect password");
        }

        // Authentication successful

        console.log("Welcome to the Home page");
        res.send("Welcome to the Home page");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
    
app.post("/signup",  async (req,res)=>{
    console.log("Request Body:", req.body);
  

try{

  // Verify reCAPTCHA
  const verifyRecaptcha = () => new Promise((resolve, reject) => {
    recaptcha.verify(req, (error, data) => {
        if (error) {
            reject(error);
        } else {
            resolve(data);
        }
    });
});

const recaptchaData = await verifyRecaptcha();
console.log("reCAPTCHA verification passed");  

    const data ={
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    };
    
     const userdata = await collection.create(data);
    console.log(userdata);


    //redirect to the home page
    //sendverification email
    sendVerificationEmail(userdata.email);
        console.log("User registered Successfully!");
        res.send("User registered Successfully! Check your email for verification.");
    } catch (error) {
        console.error("Error in signup route:", error);
        res.status(500).send("Internal server Error");
    }    

});


// ... (connection port)
const port = 5000;
app.listen(port, ()=>{
    console.log('server running on port: 5000');
});

//function to send a verification email
function sendVerificationEmail(email){
    //create nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
           user: 'manojsah@ismt.edu.np',
            pass: 'system@12345',
        },
    });
    const mailOptions ={
        from: 'manojsah@ismt.edu.np',
        to:email,
        subject:'Account Verification',
        html: `<p>Click <a href="http://localhost:5000/verify/${email}">here</a> to verify your account.</p>`,
    };
    console.log("Sending email to:", email);
    transporter.sendMail(mailOptions, (error,info)=>{
        if (error){
            console.error("Email sending error:",error);
        } else {
            console.log('Email sent:' + info.response);
        }
    });
}


app.get('/verify/:email', async(req,res)=>{
    const email = req.params.email;

    try {
        const user = await collection.findOne({ email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (user.isVerified) {
            return res.send("User is already verified.");
        }

        // Update user's isVerified field
        user.isVerified = true;
        await user.save();

        console.log("User verified successfully!");
        res.send("User verified successfully!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

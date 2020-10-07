const express = require("express");
const { request, response } = require("express");

const User = require("./models/User");
const authRoutes = require("./routes/auth-routes");
const passportSetup = require("./models/passport-setup");


const cookieSession = require('cookie-session');

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20');

const session = require('express-session')
const e = require('express')

const bodyParser = require('body-parser');


const app = express()
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(session({
  secret : '$$$DEakinSecret',
  resave: false,
  saveUninitialized: false, 
  cookie: {maxAge: 12000 }
}))
app.use(passport.initialize());
app.use(passport.session());




const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

const mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/iCrowdTaskDB', { useNewUrlParser: true });


const connection = mongoose.connection;

const https = require("https");

const validator = require("validator");

connection.once("open", function() {
    console.log("MongoDB database connection established successfully");
  });

const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const sgMail = require("@sendgrid/mail");
const passportLocalMongoose = require ('passport-local-mongoose')

app.use('/auth', authRoutes);



app.get('/', (req,res)=>{
    res.render('reqlogin') ;
});
app.get('/reqtask', (req,res)=>{
    
    if (req.isAuthenticated()){
        res.render('reqtask') ;
    }
      else {
        res.render('reqlogin') ;
    }
});
app.get('/reqsignup', (req,res)=>{
    res.render('reqsignup') ;
});
app.get('/reqreset', (req,res)=>{
    res.render('reqreset') ;
});
app.get('/reqresetpassword/:id', (req,res)=>{
    res.render('reqresetpassword') ;
    const id = req.params.id;
    //console.log(id);
});



app.post('/reqreset', async (req,res)=>{
 
    const user = await User.findOne({ email: req.body.email },[{'_id':true,'firstname':true,'email':true}]).exec();
        if(!user) {
            return res.status(400).send({ message: "The username does not exist" });
        }
        const userId = user.id;

        const userEmail = req.body.email;
        const name = user.firstname;
        //console.log('sfgfsfg'+userId) 

    const resetLink = `http://localhost:8000/reqresetpassword/${userId}`;
    
    console.log(userEmail) 
  
    const data = {
        update_existing:true,
        tags:[{"name": "resetPass", "status": "subscribed"}],            

        members:[{
            email_address: userEmail,
            merge_fields:{
                RESETLINK: resetLink,
                TRIGGER: "1",
            },
            
        }]
    }
    
    jsonData = JSON.stringify(data)
    
    const url= "https://us17.api.mailchimp.com/3.0/lists/ffd53e9d2b"
    const options={
        method:"POST",
        auth:"pav:cee70345cc7f9a9dd4bdf9a875cc31cc-us17"
        
    }


    const request = https.request(url, options , (response)=>{

        response.on("data", (data)=> {
            console.log(JSON.parse(data))
        })

    })

    request.write(jsonData)
    request.end()
});




app.post('/reqresetpassword/:id', async (req, res)=>{ 
    const id = req.params.id;
    console.log(id);

    const passwordReset = req.body.resetPassword;
    const rePasswordReset = req.body.resetPasswordConfirm;

User.findById(id, function (err, user) {



    if (!user) {
        return res.status(400).send({ message: "The username does not exist" });
    }


    // validate 
    if (passwordReset !== rePasswordReset) 
    {
            {console.log("Password must be same")
            throw new Error('Password must be same')
        }
    } 
    user.password = passwordReset;
    user.save(function (err) {

        res.redirect('/');
    });
});


});
    
        


app.post('/', async (req, res)=>{ 

    const user = await User.findOne({ email: req.body.email }).exec();
        if(!user) {
            return res.status(400).send({ message: "The username does not exist" });
        }
        const passCompare = bcrypt.compareSync(req.body.password, user.password);
        if(!passCompare) {
            return res.status(400).send({ message: "The password is invalid" });
        }

        if (user && passCompare) {
            passport.authenticate('local')(req, res , () => {res.redirect('/reqtask')})
            //return res.sendFile(__dirname + "/reqtask.html")
        }

});

app.post('/reqsignup', (req, res)=>{  
    const country = req.body.countrySelect

    const firstname = req.body.firstNameSelect
    const lastname = req.body.lastNameSelect

    const email = req.body.emailSelect
    const password = req.body.passwordSelect
    const rePassword = req.body.passwordSelect2
    
    const address1 = req.body.addressSelect
    const address2 = req.body.addressSelect2
    const city = req.body.citySelect
    const state = req.body.stateSelect
    const postcode = req.body.postcodeSelect
    const mobileNum = req.body.mobileNumSelect

    const address = address1 + " " + address2

    if (password !== rePassword) 
    {
            {console.log("Password must be same")
            throw new Error('Password must be same')
        }
    } 
    
    
    const user = new User(
        { 
            country: country,
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            //rePassword: rePassword,
            address: address, 
            city: city,
            state: state,
            postcode: postcode,
            mobileNum: mobileNum
        }
        
    )



user.save().catch((err) => {
    console.log(err)

    res.status(422)

    res.send("Error # " + res.statusCode + " " + err.message)
})

const data = {
    members:[{
        email_address: email,
        status : "subscribed",
        merge_fields:{
            FNAME: firstname,
            LNAME:lastname
        }
    }]
}

jsonData = JSON.stringify(data)
    
    const url= "https://us17.api.mailchimp.com/3.0/lists/ffd53e9d2b"
    const options={
        method:"POST",
        auth:"pav:cee70345cc7f9a9dd4bdf9a875cc31cc-us17"
        
    }


    const request = https.request(url, options , (response)=>{

        response.on("data", (data)=> {
            console.log(JSON.parse(data))
        })

    })

    request.write(jsonData)
    request.end()

if(res.statusCode == 200){
    passport.authenticate('local')(req, res , () => {res.redirect('/reqtask')})

}else {
    res.redirect('/reqsignup');
  }
    
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, (req,res)=>{
    console.log("Server is running successfullly on " +port)
})
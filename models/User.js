const mongoose = require("mongoose")
const validator = require("validator")

const bcrypt = require('bcrypt-nodejs')

const passportLocalMongoose = require ('passport-local-mongoose')

const hash_password = function( password ) {
    let salt = bcrypt.genSaltSync(); // enter number of rounds, default: 10
    let hash = bcrypt.hashSync( password, salt );
    return hash;
}

const userSchema = new mongoose.Schema(

    {
    //  _id: {type: String, 
    //     required:true
    // },
    
    country:{type: String ,  
        required:true,
        validate(value){
            if (validator.isEmpty(value))
            {console.log("Enter country")
            throw new Error('Enter country')}
        }
    },
    firstname:{type: String ,
        required:true,
    },
    lastname:{type: String ,
        required:true,
    },
    email:{type: String ,
        lowercase:true,
        required:true,
        validate(value){
            if (validator.isEmpty(value))
            {console.log("Enter Email")
            throw new Error('Enter Email')} 
            else if (!validator.isEmail(value)) 
            {console.log("The email is not valid!")
            throw new Error('The email is not valid!')} 
        }  
    },
    password:{type: String , 
        minlength:8,
        required:true,
        
        
        
    },
    // rePassword:{type: String , 
    //     minlength:8,
    //     required:true,
        
    // },
    address:{type: String , 
        minlength:3,
        maxlength:100,
        required:true,
        
        validate(value){
            if (validator.isEmpty(value))
            {console.log("Enter Address")
            throw new Error('Enter Address')}
        },
        
    },
    city:{type: String , 
        minlength:3,
        maxlength:50,
        trim:true,
        required:true,
        validate(value){
            if (validator.isEmpty(value))
            {console.log("Enter CIty")
            throw new Error('Enter CIty')}
        }
    },
    state:{type: String , 
        minlength:3,
        maxlength:50,
        required:true,
        lowercase:true,
        validate(value){
            if (validator.isEmpty(value))
            {console.log("Enter State")
            throw new Error('Enter State')}
        }
    },
    postcode:{type: String , 
        maxlength:50,
        trim:true,
    },
    mobileNum:{type: String ,
        validate(value){
            if (!validator.isMobilePhone(value))
            {console.log("The mobile number is not valid!!")
            throw new Error('The mobile number is not valid!')}
        }
    }
    
}

)







userSchema.methods.comparePassword = function(password) {
    if ( ! this.password ) { return false; }
    return bcrypt.compareSync( password, this.password );
};

userSchema.pre('save', function(next) {
    // check if password is present and is modified.
    if ( this.password && this.isModified('password') ) {
        this.password = hash_password(this.password);
    }
    
    next();
});




// UserSchema.methods.comparePasswordLogin = function(candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };

module.exports = mongoose.model("User", userSchema)

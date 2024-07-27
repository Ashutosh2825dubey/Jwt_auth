const mongoose = require('mongoose');
const {isEmail }=require('validator')//destructuring to extract specific part from module it is used to vlidate email and all
const bcrypt=require('bcrypt')//hashing password
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true,'Please Enter an email'],
        unique: true,//we cannot send custom msg here so look for info in erro that is error code which is 11000 now when tested
        lowercase: true,
        //anyone can enter just a string but that not valid email to validate we use another property ,here first argument is function that validates the value and second is to return msg if not as per function,
        //validate isEmail is used instead of function as it is a package in node
        // validate:[(val)=>{

        // },'Please enter a valid Email']
            validate:[isEmail,'Please enter a valid Email']

    },
    password: {
        type: String,
        required:[true,'Please enter an password'],
        minlength: [6,'Minimum password length is 6 characters']
    }
});
//mongoose hooks lecture 6 used to hash pasword before saving as if db is compromised all gone
// fire a function doc saved to db 
// we have to use next() for any kind of mongoose hooks or middlewares
//  the hooks below is firing after the user input is saved in the db it is like post some thing
userSchema.post('save',function(doc,next){//doc is saved then returned here
   console.log('new user was created & saved',doc);
   next();

});
//testing-fire a function before doc is saved in the db
userSchema.pre('save',async function(next){// no doc as before saving
    //normal function is used because this refers to instance of the user created to be stored in the database
    // this
    const salt=await bcrypt.genSalt();//used for more protection,uniqueness,security
    this.password=await bcrypt.hash(this.password,salt);
    // console.log('user about to be created & save',this);
    next();

})
//static method to login user
userSchema.statics.login=async function(email,password){
    const user=await this.findOne({email:email});
    if(user){
         const auth=await bcrypt.compare(password,user.password);
         if(auth){
            return user;
         }
         throw Error('incorrect password');
    }
    throw Error('incorrect email')
}

const User = mongoose.model('User', userSchema);

module.exports = User;

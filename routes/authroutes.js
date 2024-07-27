const { Router }=require('express') 
// This approach uses object destructuring to directly extract the Router function from the express module.
const router=Router();
const authcontroller=require('../controller/authcontroller');


router.get('/signup',authcontroller.signup_get);
router.post('/signup',authcontroller.signup_post);
router.get('/login',authcontroller.login_get);
router.post('/login',authcontroller.login_post);
router.get('/logout',authcontroller.logout_get);
module.exports=router;

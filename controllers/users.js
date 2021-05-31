const user = require('../models/user');
class Users{
    //renders the index
    index(req, res) {
        res.render("index", {errorMessage: req.session.errors, errorEmail: req.session.error_email_valid, errorRequired: req.session.error_required, registeredSuccess: req.session.registered_success, passwordMismatch: req.session.error_confirm_password});
        req.session.destroy();
    }
    //renders the registration form and handles the registration process and email validation
    async registerForm(req, res) {
        //getting all users from database
        let getUser = await user.get_all_users(req.body.email);
            try {
                if(getUser.email === req.body.email) {
                    console.log('email used, cant register');
                    req.session.error_email_valid = 'Email has been used, Please try again.';
                } else 
                if(req.body.email == '') {
                    req.session.error_required = 'Please fill up the form.'
                } else if(req.body.password !== req.body.confirm_password){
                    req.session.error_confirm_password = 'Password mismatch. Please try again';
                } else {
                    console.log('different email, can register');
                    req.session.registered_success = 'Registered Successfully!';
                    user.registered(req.body);
                }
            } catch(err) {
                console.log("Error: ", err);
            }
        res.redirect('/');
    }
    //renders the login form and handles the login process
    async loginForm(req, res) {
        let error_msg = 'User Not Found. Please try again.';
        let studentUser = await user.loginProcess(req.body);
        if(studentUser.password !== req.body.password || studentUser == '') {
            req.session.errors = error_msg;
            console.log(req.session.errors);
            res.redirect('/');
        } else {
            req.session.islogin = true;
            req.session.firstname = studentUser.first_name;
            req.session.lastname = studentUser.last_name;
            req.session.email = studentUser.email;
            res.redirect('/students/profile');
        }
    }
    //renders the profile page if the user has successfully login
    successLogin(req, res) {
        if(req.session.islogin == true) {
            res.render("profile", {studentFirstName: req.session.firstname, studentLastName: req.session.lastname, studentEmail: req.session.email});
        } else {
            res.redirect('/');
        }        
    }
    logout(req, res){
        req.session.destroy();
        res.redirect('/');
    }
}
module.exports = new Users;
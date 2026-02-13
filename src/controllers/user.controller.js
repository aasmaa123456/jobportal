import UserModel from '../models/user.model.js';//stores validates

export default class UserController {

    getRegister(req, res) {
        if (req.session.user) {
            return res.redirect('/jobs');
        }
        res.render('users/register', { title: 'Register', errorMessage: null });
    }

    postRegister(req, res) {
        const { name, email, password } = req.body;
        // Basic validation
        if (!name || !email || !password) {
            return res.render('users/register', { title: 'Register', errorMessage: 'All fields are required.' });
        }

        const existingUser = UserModel.findByEmail(email);
        if (existingUser) {
            return res.render('users/register', { title: 'Register', errorMessage: 'Email already exists.' });
        }

        UserModel.add(name, email, password);//memory array
        res.redirect('/login');
    }

    getLogin(req, res) {
        if (req.session.user) {
            return res.redirect('/jobs');
        }//already logged in
        res.render('users/login', { title: 'Login', errorMessage: null });
    }

    postLogin(req, res) {
        const { email, password } = req.body;

        const user = UserModel.login(email, password);
        if (!user) {
            return res.render('users/login', { title: 'Login', errorMessage: 'Invalid email or password.' });
        }

        req.session.user = user;
        res.redirect('/jobs');
    }

    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.redirect('/jobs');
            }
            res.clearCookie('connect.sid'); // Clear session cookie
            res.redirect('/login');
        });
    }
}

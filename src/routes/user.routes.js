import express from 'express';
import UserController from '../controllers/user.controller.js';//class
//rendetr register login login user logout logics

const router = express.Router();//mini express app 
const userController = new UserController();

// Using bind to keep 'this' context if methods use 'this'
router.get('/register', userController.getRegister);//ejs
router.post('/register', userController.postRegister);
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/logout', userController.logout);

export default router;

import { Router } from "express";
import User from "../apis/user";

const router = Router();

router.get('/', (req, res) => {
    res.send('welcome to User')
})

router.post('/register', User.register);
router.post('/login', User.login);
router.post('/verify-otp', User.verifyOTP)


export default router;
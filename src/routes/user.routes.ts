import { Router } from "express";
import User from "../apis/user";

const router = Router();

router.get('/', (req, res) => {
    res.send('welcome to User')
})

router.get('/:id', User.secrets);

router.post('/register', User.register);
router.post('/login', User.login);
router.post('/scan', User.scan);
router.post('/verify-otp', User.verifyOTP)
router.post('/verify-totp', User.verifyTOTP)


export default router;
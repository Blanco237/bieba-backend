import { Router } from "express";
import Organization from "../apis/organization";

const router = Router();

router.get('/', (req, res) => {
    res.send('welcome to Organization')
})

router.post('/register', Organization.register)
router.post('/login', Organization.login)
router.post('/send-otp', Organization.sendOTP)
router.post('/verify-otp', Organization.verifyOTP)


export default router;
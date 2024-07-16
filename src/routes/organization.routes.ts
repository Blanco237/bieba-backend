import { Router } from "express";
import Organization from "../apis/organization";

const router = Router();

router.get('/', (req, res) => {
    res.send('welcome to Organization')
})

router.get('/:id', Organization.get);

router.post('/register', Organization.register)
router.post('/login', Organization.login)
router.post('/send-otp', Organization.sendOTP)
router.post('/verify-otp', Organization.verifyOTP)
router.post('/verify', Organization.verify)
router.post('/update-callback', Organization.updateCallback)
router.post('/get-user', Organization.getUser)


export default router;
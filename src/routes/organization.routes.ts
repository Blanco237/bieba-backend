import { Router } from "express";
import Organization from "../apis/organization";

const router = Router();

router.get('/', (req, res) => {
    res.send('welcome to Organization')
})

router.post('/register', Organization.register)


export default router;
import { Router } from 'express';
import Patients from '../apis/patient/patient';

const router = Router();

router.get('/', (req, res) => {
    res.send('welcome to patient')
})

router.post('/new', Patients.add);

// Appointments
router.post('/appointment/book', Patients.appointments.book);


export default router;
import { Request, Response } from 'express'
import graphql from '../../helpers/graphql'
import { removeFalsy } from '../../helpers/functions'

const Appointments: { book: any } = {
  book: {}
}

Appointments.book = async (req: Request, res: Response) => {
  const body = req.body
  body.approval_status = 'Pending'
  body.status = 'Pending'
  body.comments = body.comment
  const notification = {
    type: 'appointment',
    receiver_id: body.doctor_id,
    hospital_id: body.hospital_id,
    details: {
      dueDate: body.date,
      patient: body.patient,
      avatar: body.patient_avatar,
      link: '',
      creation_date: new Date()
    }
  }
  delete body.comment
  delete body.doctor
  delete body.hospital
  delete body.id
  delete body.patient_avatar
  delete body.doctor_avatar
  const cleanedBody = removeFalsy(body)
  delete cleanedBody.patient

  try {
    const dailyAptRes = await graphql(
      `
        query GetDailyAppointments(
          $day: timestamp!
          $doctor_id: uuid!
          $patient_id: uuid!
        ) @cached {
          doctors: appointments(
            where: { date: { _eq: $day }, doctor_id: { _eq: $doctor_id } }
          ) {
            start_time
            end_time
          }
          patients: appointments(
            where: { date: { _eq: $day }, patient_id: { _eq: $patient_id } }
          ) {
            start_time
            end_time
          }
        }
      `,
      {
        day: cleanedBody.date,
        doctor_id: cleanedBody.doctor_id,
        patient_id: cleanedBody.patient_id
      }
    )

    const { patients, doctors } = dailyAptRes.data
    
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e })
  }

  try {
    const response = await graphql(
      `
        mutation InsertNewAppoint($data: appointments_insert_input!) {
          insert_appointments_one(object: $data) {
            id
          }
        }
      `,
      { data: cleanedBody }
    )

    if (response.data.insert_appointments_one.id) {
      if (body.patient.temphospital) {
        // REMOVE TEMP HOSPITAL FROM PATIENT IF PRESENT
        graphql(
          `
            mutation RemoveTempPatient($patient_id: uuid!) {
              update_patients_by_pk(
                pk_columns: { id: $patient_id }
                _set: { temphospital: null }
              ) {
                id
              }
            }
          `,
          { patient_id: body.patient_id }
        )
      }

      notification.details.link = response.data.insert_appointments_one.id
      const response2 = await graphql(
        `
          mutation MyMutation($data: notifications_insert_input!) {
            insert_notifications_one(object: $data) {
              id
            }
          }
        `,
        { data: notification }
      )
      if (response2.data.insert_notifications_one.id) {
        res.status(201).json(response.data.insert_appointments_one)
      } else {
        console.log(response)
        res.status(400).json(response2)
      }
    } else {
      console.log(response)
      res.status(400).json(response)
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e })
  }
}

export default Appointments

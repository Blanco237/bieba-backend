import { Request, Response } from 'express'
import Appointments from './appointments'
import appConstants from '../../appConstants'
import graphql from '../../helpers/graphql'
import Crypt from '../../services/crypt.service'
import MailerFunctions from '../mailer/mails'

type PatientFunctionsType = {
  appointments: typeof Appointments
  add: any
}

const Patients: PatientFunctionsType = {
  appointments: Appointments,
  add: {}
}

Patients.add = async (req: Request, res: Response) => {
  const role = appConstants.ROLES.PATIENT
  const { basedemographicinfo, patientinfo, hospital } = req.body

  let password = ''
  let unhashed = ''
  const crypt = new Crypt()
  unhashed = await crypt.generateRandomString()

  const patientExistQuery = `
  query patientUsernameExist($username: String!, $first_name: String!, $last_name: String!) {
    patients(where: {username: {_eq: $username}}) {
      username
    }
    basedemographicinfo(where: {first_name: {_eq: $first_name}, last_name: {_eq: $last_name}, role: {_eq: "PATIENT"}}) {
      first_name
      last_name
    }
  }  
  `

  const patientExistsResponse = await graphql(patientExistQuery, {
    username: patientinfo.username,
    last_name: basedemographicinfo.last_name,
    first_name: basedemographicinfo.first_name
  })

  console.log(patientExistsResponse)
  if (
    patientExistsResponse.data &&
    (patientExistsResponse.data.patients.length > 0 ||
      patientExistsResponse.data.basedemographicinfo.length > 0)
  ) {
    return res.status(400).json({ error: 'Username Already Exists' })
  }
  if (!patientExistsResponse.data) {
    return res.status(500).json(patientExistsResponse.errors)
  }

  try {
    password = await crypt.hash(unhashed)
  } catch (e) {
    console.error(e)
    return res.status(500).json(e)
  }

  const patient = {
    ...patientinfo,
    password,
    basedemographicinfo: { data: { ...basedemographicinfo, role } },
    patientprofile: { data: {} },
    temphospital: hospital
  }

  const query = `mutation CreateNewPatient($patient: patients_insert_input!) {
        insert_patients_one(object: $patient) {
          id
          blood_group
          email
          guardian
          basedemographicinfo {
            address
            country
            date_of_birth
          }
        }
      }`

  try {
    const hasuraResponse = await graphql(query, { patient: patient })
    const data = hasuraResponse.data
    if (data) {
      const user = {
        name: `${basedemographicinfo.first_name} ${basedemographicinfo.last_name}`,
        password: unhashed,
        user_name: patientinfo.username,
        type: 'Patient'
      }
      try {
        const response = await MailerFunctions.sendWelcome(
          patientinfo.email,
          user
        )
        if (response.error) {
          return res.status(500).json(response.error)
        }
        return res.json(data)
      } catch (error) {
        return res.status(500).json(error)
      }
    }
    return res.status(500).json(hasuraResponse.errors)
  } catch (e) {
    console.error(e)
    return res.status(500).json(e)
  }
}

export default Patients

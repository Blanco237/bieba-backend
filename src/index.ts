import express, { Application } from 'express'
import cors from 'cors'
import appConstants from './appConstants'
import patientRouter from './routes/patient.routes'

const app: Application = express()

app.use(
  express.json({
    limit: '5mb'
  })
)
app.use(cors())


app.use('/patient', patientRouter)

app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

const port = appConstants.PORT

app.listen(port, () => {
  console.log(`Server running on ${port}`)
})

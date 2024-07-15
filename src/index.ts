import express, { Application } from 'express'
import cors from 'cors'
import appConstants from './appConstants'
import organizationRouter from './routes/organization.routes'
import userRouter from './routes/user.routes'
import Crypt from './services/crypt/crypt.service'

const app: Application = express()

app.use(
  express.json({
    limit: '5mb'
  })
)
app.use(cors())


app.use('/organization', organizationRouter)
app.use('/user', userRouter)


app.get('/health', (req, res) => {
  
  res.status(200).send('OK')
})

const port = appConstants.PORT

app.listen(port, () => {
  console.log(`Server running on ${port}`)
})

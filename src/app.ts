import express from 'express'
import helmet from 'helmet'
import routers from './routers'
import errorHandler from './middlewares/errorHandler.middleware'

const app = express()

app.use(helmet())
app.use(express.json())
app.use(routers)
app.use(errorHandler)

export default app

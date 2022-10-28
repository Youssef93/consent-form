import {
  Request, Response, ErrorRequestHandler, NextFunction
} from 'express'
import { ServerError } from '../types/error.types'

const handleError: ErrorRequestHandler = (
  err: TypeError | ServerError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  // usually better if included in its own middleware for better logging
  if (process.env.NODE_ENV !== 'test') console.error(err)

  let customError = err

  if (!(err as ServerError).isCustomError) {
    customError = new ServerError('Internal Server Error')
  }

  const message = customError.message ? { message: customError.message } : []

  res.status((customError as ServerError).status).json(message)
}

export default handleError
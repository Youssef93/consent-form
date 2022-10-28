import * as Joi from 'joi'
import Express from 'express'
import { IEndpointSchema } from '../types/schema.types'
import { ServerError } from '../types/error.types'

export const validationMiddleware = (schema: IEndpointSchema) => {
  return async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    const reqToValidate: any = {}

    // in real world scenario we should add the params as well
    // Also we can take the output of the result object & put it back in the request object to take advantage of joi conversion functions
    if(schema?.body) reqToValidate.body = req.body
    if(schema?.params) reqToValidate.params = req.params
  
    const validationSchema = Joi.object(schema)
  
    const result = validationSchema.validate(reqToValidate)

    if (result.error) {
      const error = new ServerError(result.error.message, 400)
      next(error)
    }
  
    await next()
  }
}
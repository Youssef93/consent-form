import * as Joi from 'joi'
import { IEndpointSchema } from '../types/schema.types'

const consentBody = {
  // in a real world scenario we would have stricter validation (like length, ..etc)
  name: Joi.string().required(),
  consent_url: Joi.string().uri().required()
}

const consentParams = {
  targetId: Joi.string().uuid({ version: 'uuidv4' })
}

export const createConsentSchema: IEndpointSchema = {
  body: Joi.object({ ...consentBody }).required()
}

export const getTargetConsentSchema: IEndpointSchema = {
  params: Joi.object({ ...consentParams }).required()
}

export const createNewConsentVersionSchema: IEndpointSchema = {
  params: Joi.object({ ...consentParams }).required(),
  body: Joi.object({ ...consentBody }).required()
}
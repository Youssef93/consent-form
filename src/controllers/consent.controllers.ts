import * as consentService from '../services/consent.services'
import Express from 'express'

export const createConsent = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  try {
    const result = await consentService.createConsent(req.body)
    res.json(result).status(200)
  } catch(e: any) {
    next(e)
  }
}

export const getTargetConsents = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  try {
    const result = await consentService.getTargetConsents(req.params.targetId)
    res.json(result).status(200)
  } catch(e: any) {
    next(e)
  }
}

export const createNewConsentVersion = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  try {
    const result = await consentService.createConsentVersion(req.params.targetId, req.body)
    res.json(result).status(200)
  } catch(e: any) {
    next(e)
  }
}

export const getAllConsents = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  try {
    const result = await consentService.getAllConsents()
    res.json(result).status(200)
  } catch(e: any) {
    next(e)
  }
}
import express from 'express'
import * as consentController from './controllers/consent.controllers'
import { validationMiddleware } from './middlewares/validation.middleware'
import * as consentSchemas from './schemas/consent.schemas'

const router = express.Router()

router.post('/consent/target', validationMiddleware(consentSchemas.createConsentSchema), consentController.createConsent)
router.get('/consent/target/:targetId', validationMiddleware(consentSchemas.getTargetConsentSchema), consentController.getTargetConsents)
router.patch('/consent/target/:targetId', validationMiddleware(consentSchemas.createNewConsentVersionSchema), consentController.createNewConsentVersion)
router.get('/consent/target', consentController.getAllConsents)

export default router

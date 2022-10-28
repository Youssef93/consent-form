import express from 'express'
import * as consentController from './controllers/consent.controllers'
import { joiMiddleware } from './middlewares/joi.middleware'
import * as consentSchemas from './schemas/consent.schemas'

const router = express.Router()

router.post('/consent/target', joiMiddleware(consentSchemas.createConsentSchema), consentController.createConsent)
router.get('/consent/target/:targetId', joiMiddleware(consentSchemas.getTargetConsentSchema), consentController.getTargetConsents)
router.patch('/consent/target/:targetId', joiMiddleware(consentSchemas.createNewConsentVersionSchema), consentController.createNewConsentVersion)
router.get('/consent/target', consentController.getAllConsents)

export default router

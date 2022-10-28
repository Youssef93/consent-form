import * as consentRepository from '../repositories/consent.repositories'
import { IConsentEntity, IConsentResponse, ICreateConsentEntity } from '../types/consent.types'
import { ServerError } from '../types/error.types'

// This could also be added into its own mapping service if needed
const mapConsentEntity = (body: IConsentEntity): IConsentResponse => {
  const { unique_id, target_id, created_at, ...consentBody } = body
  return { ...consentBody, id: target_id, created_at: created_at.toISOString() }
}

export const createConsent = async (body: ICreateConsentEntity): Promise<IConsentResponse> => {
  const result = await consentRepository.createConsentRecord(body)
  return mapConsentEntity(result)
}

export const getTargetConsents = async (targetId: string): Promise<IConsentResponse[]> => {
  const result = await consentRepository.getTargetConsents(targetId)
  return result.map((item) => mapConsentEntity(item))
}

export const createConsentVersion = async (targetId: string, body: ICreateConsentEntity): Promise<IConsentResponse> => {
  const recordInDb = await consentRepository.getOneTargetRecord(targetId)

  if(!recordInDb) throw new ServerError(`Id ${targetId} could not be found`, 404)

  const result = await consentRepository.createNewConsentVersion(targetId, body)

  return mapConsentEntity(result)
}

export const getAllConsents = async () => {
  const result = await consentRepository.getAllConsents()
  return result.map((item) => mapConsentEntity(item))
}
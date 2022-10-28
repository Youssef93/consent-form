import { db } from '../db'
import { ICreateConsentEntity, IConsentEntity } from '../types/consent.types'

const columns = ['unique_id', 'target_id', 'name', 'consent_url', 'created_at', 'version']

export const createConsentRecord = async (data: ICreateConsentEntity):Promise<IConsentEntity> => {
  const [result] = await db<IConsentEntity>('consents').insert({ ...data, version: 0 }).returning(columns)

  return result as IConsentEntity
}

// in a real world scenario, there should be pagination for teh next 2 functions
export const getTargetConsents = async (targetId: string): Promise<IConsentEntity[]> => {
  const result = await db('consents').select(columns).where({ target_id: targetId })
  return result as IConsentEntity[]
}

export const getAllConsents = async (): Promise<IConsentEntity[]> => {
  const result = await db('consents').select(columns)
  return result as IConsentEntity[]
}

export const getOneTargetRecord = async (targetId: string): Promise<IConsentEntity> => {
  const result = await db('consents').select(columns).where({ target_id: targetId }).first()
  return result as IConsentEntity
}

export const createNewConsentVersion = async (targetId: string, data: ICreateConsentEntity): Promise<IConsentEntity> => {
  const [result] = await db('consents').insert({
    ...data,
    target_id: targetId,
    version: db('consents').select(db.raw('version + 1')).where({ target_id: targetId }).orderBy('version', 'desc').limit(1)
  }).returning(columns)
  
  return result as IConsentEntity
}
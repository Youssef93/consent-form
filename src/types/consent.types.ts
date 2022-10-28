export interface ICreateConsentEntity {
  name: string
  consent_url: string
}

interface IConsentBase {
  name: string
  consent_url: string
  version: number
}

export interface IConsentEntity extends IConsentBase {
  unique_id: string
  target_id: string
  created_at: Date
}

export interface IConsentResponse extends IConsentBase {
  id: string
  created_at: string
}
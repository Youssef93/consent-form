import { db } from '../../src/db'
import request from 'supertest'
import app from '../../src/app'
import { IConsentEntity } from '../../src/types/consent.types'

const seed = async () => {
  await db('consents').delete()

  const [target1version0] = await db('consents').insert(
    {
      name: 'target1',
      consent_url: 'http://example.com/marketing_terms_seed',
      version: 0
    }
  ).returning('*')

  const [target1version1] = await db('consents').insert(
    {
      target_id: target1version0.target_id,
      name: 'target1',
      consent_url: 'http://example.com/marketing_terms_seed_2',
      version: 1
    }
  ).returning('*')

  const [target2version0] = await db('consents').insert(
    {
      name: 'target2',
      consent_url: 'http://example.com/marketing_terms_seed',
      version: 0
    }
  ).returning('*')

  return {
    target1version0, target1version1, target2version0
  }
}

afterAll(async () => {
  db.destroy()
})

describe('Consent E2E', () => {
  let consents: Record<string, IConsentEntity> = {}

  beforeEach(async () => {
    consents = await seed()
  })

  describe('POST /consent/target', () => {
    it('should successfully create consent in the database', async () => {
      const response = await request(app).post('/consent/target').send({
        name: 'test',
        consent_url: 'http://example.com/marketing_terms_2'
      })

      expect(response.status).toEqual(200)

      expect(response.body).toStrictEqual({
        id: expect.anything(),
        name: 'test',
        consent_url: 'http://example.com/marketing_terms_2',
        created_at: expect.anything(),
        version: 0
      })

      const recordInDB = await db('consents').select('*').where('target_id', '=', response.body.id).first()
      expect(recordInDB).toBeDefined()
      expect(recordInDB).toStrictEqual({
        unique_id: expect.anything(),
        target_id: response.body.id,
        name: 'test',
        consent_url: 'http://example.com/marketing_terms_2',
        version: 0,
        created_at: expect.anything()
      })
    })

    it('returns 400 if a part of teh request is missing', async () => {
      const response = await request(app).post('/consent/target').send({
        consent_url: 'http://example.com/marketing_terms_2'
      })

      expect(response.status).toEqual(400)
      expect(response.body.message).toStrictEqual('"body.name" is required')
      const recordInDB = await db('consents').select('*').where('consent_url', '=', 'http://example.com/marketing_terms_2').first()
      expect(recordInDB).toBeUndefined()
    })

    it('returns 400 if the consent url is not a valid url', async () => {
      const response = await request(app).post('/consent/target').send({
        name: 'test',
        consent_url: 'test'
      })

      expect(response.status).toEqual(400)
      expect(response.body.message).toStrictEqual('"body.consent_url" must be a valid uri')
      const recordInDB = await db('consents').select('*').where('name', '=', 'test').first()
      expect(recordInDB).toBeUndefined()
    })
  })

  describe('GET /consent/target/:targetId', () => {
    it('should return all consents for target1', async () => {
      const response = await request(app).get(`/consent/target/${consents.target1version0.target_id}`)
      expect(response.status).toEqual(200)

      expect(response.body).toStrictEqual([
        {
          id: consents.target1version0.target_id,
          name: consents.target1version0.name,
          consent_url: consents.target1version0.consent_url,
          created_at: consents.target1version0.created_at.toISOString(),
          version: consents.target1version0.version
        },
        {
          id: consents.target1version1.target_id,
          name: consents.target1version1.name,
          consent_url: consents.target1version1.consent_url,
          created_at: consents.target1version1.created_at.toISOString(),
          version: consents.target1version1.version
        }
      ])
    })

    it('should return all consents for target2', async () => {
      const response = await request(app).get(`/consent/target/${consents.target2version0.target_id}`)
      expect(response.status).toEqual(200)

      expect(response.body).toStrictEqual([
        {
          id: consents.target2version0.target_id,
          name: consents.target2version0.name,
          consent_url: consents.target2version0.consent_url,
          created_at: consents.target2version0.created_at.toISOString(),
          version: consents.target2version0.version
        }
      ])
    })

    it('returns an empty array if the id does not exist', async () => {
      const response = await request(app).get(`/consent/target/00aaba10-ac33-4410-b0f7-c34e96c5c31b`)
      expect(response.status).toEqual(200)
      expect(response.body).toStrictEqual([])
    })

    it('returns 400 if the id is not a valid uuid', async () => {
      const response = await request(app).get(`/consent/target/some-id`)
      expect(response.status).toEqual(400)
      expect(response.body.message).toStrictEqual('"params.targetId" must be a valid GUID')
    })
  })

  describe('PATCH /consent/target/:targetId', () => {
    it('should successfully create version 2 of target 1', async () => {
      const response = await request(app)
        .patch(`/consent/target/${consents.target1version0.target_id}`)
        .send({
          name: 'test',
          consent_url: 'http://example.com/marketing_terms_2'
        })
      expect(response.status).toEqual(200)

      expect(response.body).toStrictEqual({
        id: consents.target1version0.target_id,
        name: 'test',
        consent_url: 'http://example.com/marketing_terms_2',
        created_at: expect.anything(),
        version: 2
      })

      const recordsInDB = await db('consents').select('*').where('target_id', '=', response.body.id)
      expect(recordsInDB.length).toEqual(3)

      const newRecord = recordsInDB.find((record) => record.version === 2)

      expect(newRecord).toBeDefined()
      expect(newRecord).toStrictEqual({
        unique_id: expect.anything(),
        target_id: response.body.id,
        name: 'test',
        consent_url: 'http://example.com/marketing_terms_2',
        version: 2,
        created_at: expect.anything()
      })
    })

    it('should successfully create version 1 of target 2', async () => {
      const response = await request(app)
        .patch(`/consent/target/${consents.target2version0.target_id}`)
        .send({
          name: 'test',
          consent_url: 'http://example.com/marketing_terms_2'
        })
      expect(response.status).toEqual(200)

      expect(response.body).toStrictEqual({
        id: consents.target2version0.target_id,
        name: 'test',
        consent_url: 'http://example.com/marketing_terms_2',
        created_at: expect.anything(),
        version: 1
      })

      const recordsInDB = await db('consents').select('*').where('target_id', '=', response.body.id)
      expect(recordsInDB.length).toEqual(2)

      const newRecord = recordsInDB.find((record) => record.version === 1)

      expect(newRecord).toBeDefined()
      expect(newRecord).toStrictEqual({
        unique_id: expect.anything(),
        target_id: response.body.id,
        name: 'test',
        consent_url: 'http://example.com/marketing_terms_2',
        version: 1,
        created_at: expect.anything()
      })
    })

    it('returns 404 if teh target id is not found', async () => {
      const response = await request(app)
        .patch(`/consent/target/00aaba10-ac33-4410-b0f7-c34e96c5c31b`)
        .send({
          name: 'test',
          consent_url: 'http://example.com/marketing_terms_2'
        })
      expect(response.status).toEqual(404)

      expect(response.body.message).toStrictEqual("Id 00aaba10-ac33-4410-b0f7-c34e96c5c31b could not be found")

      const recordsInDB = await db('consents').select('*').where('consent_url', '=', 'http://example.com/marketing_terms_2')
      expect(recordsInDB.length).toEqual(0)
    })

    it('returns 400 if the id is not a valid uuid', async () => {
      const response = await request(app)
        .patch(`/consent/target/test`)
        .send({
          name: 'test',
          consent_url: 'http://example.com/marketing_terms_2'
        })
      expect(response.status).toEqual(400)
      expect(response.body.message).toStrictEqual('"params.targetId" must be a valid GUID')
    })
  })

  describe('GET /consent/target', () => {
    it('should return all records in the database', async () => {
      const response = await request(app).get('/consent/target')
      expect(response.status).toEqual(200)
      expect(response.body).toStrictEqual([
        {
          id: consents.target1version0.target_id,
          name: consents.target1version0.name,
          consent_url: consents.target1version0.consent_url,
          created_at: consents.target1version0.created_at.toISOString(),
          version: consents.target1version0.version
        },
        {
          id: consents.target1version1.target_id,
          name: consents.target1version1.name,
          consent_url: consents.target1version1.consent_url,
          created_at: consents.target1version1.created_at.toISOString(),
          version: consents.target1version1.version
        },
        {
          id: consents.target2version0.target_id,
          name: consents.target2version0.name,
          consent_url: consents.target2version0.consent_url,
          created_at: consents.target2version0.created_at.toISOString(),
          version: consents.target2version0.version
        }
      ])
    })
  })
})
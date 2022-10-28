import { Schema } from 'joi'

export interface IEndpointSchema {
  body?: Schema,
  params?: Schema
}
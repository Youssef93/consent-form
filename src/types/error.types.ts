export class ServerError extends Error {
  message: string

  status: number

  isCustomError: boolean

  constructor(message: string, status = 500) {
    super(message)
    this.message = message
    this.status = status
    this.isCustomError = true
  }
}
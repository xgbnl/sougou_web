// Next Auth Imports
import { CredentialsSignin } from 'next-auth'

export default class CredentialSigninError extends CredentialsSignin {
  code: string
  constructor(msg: string, code: number) {
    super(msg)
    this.code = JSON.stringify({ msg, code })
  }
}

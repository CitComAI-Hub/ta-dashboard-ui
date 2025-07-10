export interface TrustedIssuer {
  id: string
  name: string
  did: string
  jwks?: string
  credentialsSupported?: CredentialSupported[]
  status?: "active" | "inactive" | "pending"
  createdAt?: string
  updatedAt?: string
}

export interface CredentialSupported {
  type: string
  format?: string
  cryptographic_binding_methods_supported?: string[]
  cryptographic_suites_supported?: string[]
}

export interface EBSIIssuer {
  did: string
  credentials_supported: CredentialSupported[]
  authorization_server?: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

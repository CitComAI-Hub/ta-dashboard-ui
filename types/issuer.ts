export interface TrustedIssuer {
  id: string
  did: string
  status?: "active" | "inactive" | "pending"
  createdAt?: string
  updatedAt?: string
}

export interface EBSIIssuer {
  did: string
  credentials_supported: CredentialMetadata[]
  authorization_server?: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface CredentialMetadata {
  type: string
  format?: string
  cryptographic_binding_methods_supported?: string[]
  cryptographic_suites_supported?: string[]
}

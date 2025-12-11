import type { TrustedIssuer, EBSIIssuer, ApiResponse } from "../types/issuer"
import { getToken, logout } from "./auth"

// Unificación de variables de entorno
declare global {
  interface Window { env: any }
}
function getBaseUrl() {
  if (typeof window !== "undefined" && window.env?.NEXT_PUBLIC_API_URL) {
    return window.env.NEXT_PUBLIC_API_URL;
  }
  return "";
}

const ISSUER_API = "/api/issuer";
const REGISTRY_API = "/api/v4/issuers";

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = getToken();
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
    const headers = Object.assign(
      { "Content-Type": "application/json" },
      authHeader,
      options.headers || {}
    );
    try {
      const response = await fetch(`${getBaseUrl()}${endpoint}`, {
        headers,
        ...options,
      })

      // Si es 204 No Content, retorna éxito sin data
      if (response.status === 204) {
        return { data: undefined as any }
      }

      // Si es 201 Created y no hay body, retorna éxito
      if (response.status === 201) {
        const text = await response.text()
        if (!text) return { data: undefined as any }
        try {
          const data = JSON.parse(text)
          return { data }
        } catch {
          return { data: undefined as any }
        }
      }

      // Si es error y hay body, intenta extraer mensaje amigable
      if (!response.ok) {
        if (response.status === 401) {
          logout()
          return { error: "Session expired. Please log in again." }
        }
        let errorMsg = `HTTP error! status: ${response.status}`
        try {
          const err = await response.json()
          if (err && (err.title || err.detail)) {
            errorMsg = `${err.title || ''}${err.detail ? ': ' + err.detail : ''}`.trim()
          }
        } catch {}
        return { error: errorMsg }
      }

      // Normal: parsea JSON
      const data = await response.json()
      return { data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }
    }
  }

  // Trusted Issuers List API (alta de nuevos issuers)
  async createTrustedIssuer(issuer: Omit<TrustedIssuer, "id">): Promise<ApiResponse<TrustedIssuer>> {
    // Construir el payload correcto para el backend
    const payload = {
      did: issuer.did.trim(),
    };
    return this.request<TrustedIssuer>(ISSUER_API, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async updateTrustedIssuer(originalDid: string, issuer: Omit<TrustedIssuer, "id">): Promise<ApiResponse<TrustedIssuer>> {
    const trimmedDid = issuer.did?.trim()
    const targetDid = trimmedDid && trimmedDid.length > 0 ? trimmedDid : originalDid.trim()
    const payload = {
      did: targetDid,
    }
    return this.request<TrustedIssuer>(`${ISSUER_API}/${encodeURIComponent(targetDid)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  }

  // Trusted Issuers Registry API (listado público)
  async getEBSIIssuers(): Promise<ApiResponse<TrustedIssuer[]>> {
    // Llama al proxy del auth-backend para evitar CORS
    const response = await this.request<any>(REGISTRY_API, { method: "GET" })
    if (response.data && Array.isArray(response.data.items)) {
      const trustedIssuers = response.data.items.map((item: any) => ({
        did: item.did,
        id: item.did,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }))
      return { data: trustedIssuers }
    } else if (response.error) {
      return { error: response.error }
    } else {
      return { error: "Unexpected response from registry API" }
    }
  }

  async getEBSIIssuer(did: string): Promise<ApiResponse<EBSIIssuer>> {
    return this.request<EBSIIssuer>(`${REGISTRY_API}/${encodeURIComponent(did)}`, { method: "GET" })
  }

  // Nuevo: eliminar issuer por did
  async deleteTrustedIssuer(did: string): Promise<ApiResponse<void>> {
    return this.request<void>(`${ISSUER_API}/${encodeURIComponent(did)}`, { method: "DELETE" })
  }
}

export const apiService = new ApiService()

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import type { TrustedIssuer, CredentialSupported } from "../types/issuer"

interface IssuerFormProps {
  issuer?: TrustedIssuer
  onSubmit: (issuer: Omit<TrustedIssuer, "id"> | TrustedIssuer) => void
  onCancel: () => void
  isLoading?: boolean
}

export function IssuerForm({ issuer, onSubmit, onCancel, isLoading }: IssuerFormProps) {
  const [formData, setFormData] = useState<Omit<TrustedIssuer, "id">>({
    did: "",
    credentialsSupported: [],
    name: "",
  })

  const [newCredential, setNewCredential] = useState<CredentialSupported>({
    type: "",
    format: "jwt_vc",
  })

  useEffect(() => {
    if (issuer) {
      setFormData({
        did: issuer.did,
        credentialsSupported: issuer.credentialsSupported || [],
        name: issuer.name || "",
      })
    }
  }, [issuer])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (issuer) {
      onSubmit({ ...formData, id: issuer.id })
    } else {
      onSubmit(formData)
    }
  }

  const addCredential = () => {
    if (newCredential.type.trim()) {
      setFormData((prev) => ({
        ...prev,
        credentialsSupported: [...(prev.credentialsSupported || []), newCredential],
      }))
      setNewCredential({ type: "", format: "jwt_vc" })
    }
  }

  const removeCredential = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      credentialsSupported: prev.credentialsSupported?.filter((_, i) => i !== index) || [],
    }))
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        {/* <CardTitle>{issuer ? "Edit Trusted Issuer" : "Add New Trusted Issuer"}</CardTitle> */}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="did">DID (Decentralized Identifier) *</Label>
            <Input
              id="did"
              value={formData.did}
              onChange={(e) => setFormData((prev) => ({ ...prev, did: e.target.value }))}
              placeholder="did:example:123456789abcdefghi"
              required
            />
          </div>

          {/* Sección opcional para añadir credenciales */}
          <div className="space-y-4">
            <Label>Supported Credentials (optional)</Label>

            {formData.credentialsSupported && formData.credentialsSupported.length > 0 && (
              <div className="space-y-2">
                {formData.credentialsSupported.map((credential, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Badge variant="secondary">{credential.type}</Badge>
                    <Badge variant="outline">{credential.format}</Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCredential(index)}
                      className="ml-auto h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={newCredential.type}
                onChange={(e) => setNewCredential((prev) => ({ ...prev, type: e.target.value }))}
                placeholder="Credential type (e.g., VerifiableCredential)"
                className="flex-1"
              />
              <Select
                value={newCredential.format}
                onValueChange={(value) => setNewCredential((prev) => ({ ...prev, format: value }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jwt_vc">JWT VC</SelectItem>
                  <SelectItem value="ldp_vc">LDP VC</SelectItem>
                  <SelectItem value="jwt_vp">JWT VP</SelectItem>
                </SelectContent>
              </Select>
              <Button type="button" onClick={addCredential} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : issuer ? "Update Issuer" : "Create Issuer"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

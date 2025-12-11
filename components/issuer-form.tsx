"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { TrustedIssuer } from "../types/issuer"

interface IssuerFormProps {
  issuer?: TrustedIssuer
  onSubmit: (issuer: Omit<TrustedIssuer, "id"> | TrustedIssuer) => void
  onCancel: () => void
  isLoading?: boolean
}

export function IssuerForm({ issuer, onSubmit, onCancel, isLoading }: IssuerFormProps) {
  const [formData, setFormData] = useState<Omit<TrustedIssuer, "id">>({
    did: "",
  })

  useEffect(() => {
    if (issuer) {
      setFormData({
        did: issuer.did,
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

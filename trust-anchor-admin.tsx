"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Shield, Globe, Users, Activity } from "lucide-react"
import type { TrustedIssuer } from "./types/issuer"
import { apiService } from "./services/api"
import { NotificationProvider, useNotification } from "./components/notification"
import { IssuerList } from "./components/issuer-list"
import { IssuerForm } from "./components/issuer-form"
import { EBSIRegistry } from "./components/ebsi-registry"

function DashboardContent() {
  const [issuers, setIssuers] = useState<TrustedIssuer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingIssuer, setEditingIssuer] = useState<TrustedIssuer | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [health, setHealth] = useState<'Healthy' | 'Error' | 'Loading'>('Loading')
  const { addNotification } = useNotification()

  const fetchIssuers = async () => {
    setIsLoading(true)
    setHealth('Loading')
    try {
      const response = await apiService.getEBSIIssuers()
      if (response.error) {
        addNotification({
          type: "error",
          title: "Failed to fetch trusted issuers",
          message: response.error,
        })
        setHealth('Error')
      } else if (response.data) {
        setIssuers(response.data)
        setHealth('Healthy')
      }
    } catch {
      setHealth('Error')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchIssuers()
  }, [])

  // Cuadros resumen
  const totalIssuers = issuers.length
  const allCredentials = issuers.flatMap(i => i.credentialsSupported || [])
  const credentialTypes = Array.from(new Set(allCredentials.map(c => c.type))).filter(Boolean)
  const lastUpdated = issuers
    .map(i => i.updatedAt)
    .filter(Boolean)
    .sort()
    .reverse()[0] || 'N/A'

  const handleAddIssuer = () => {
    setEditingIssuer(undefined)
    setIsFormOpen(true)
  }

  const handleEditIssuer = (issuer: TrustedIssuer) => {
    setEditingIssuer(issuer)
    setIsFormOpen(true)
  }

  const handleViewIssuer = (issuer: TrustedIssuer) => {
    // For now, just show edit form in read-only mode
    // In a real app, you might want a separate view component
    setEditingIssuer(issuer)
    setIsFormOpen(true)
  }

  const handleDeleteIssuer = async (id: string) => {
    const response = await apiService.deleteTrustedIssuer(id)

    if (response.error) {
      addNotification({
        type: "error",
        title: "Delete failed",
        message: response.error,
      })
    } else {
      addNotification({
        type: "success",
        title: "Issuer deleted",
        message: "The issuer was deleted successfully."
      })
      fetchIssuers()
    }
  }

  const handleFormSubmit = async (issuerData: Omit<TrustedIssuer, "id">) => {
    setIsSubmitting(true)
    const response = await apiService.createTrustedIssuer(issuerData)
    if (response.error) {
      addNotification({
        type: "error",
        title: `Create failed`,
        message: response.error,
      })
    } else {
      addNotification({
        type: "success",
        title: `Issuer created`,
        message: "The issuer was created successfully."
      })
      setIsFormOpen(false)
      setEditingIssuer(undefined)
      fetchIssuers()
    }
    setIsSubmitting(false)
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingIssuer(undefined)
  }

  const activeIssuers = issuers.filter((i) => i.status === "active").length
  const pendingIssuers = issuers.filter((i) => i.status === "pending").length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trust Anchor Administration</h1>
          <p className="text-gray-600">Manage trusted issuers in your FIWARE Data Space ecosystem</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Issuers</p>
                  <p className="text-2xl font-bold text-gray-900">{totalIssuers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Health</p>
                  <p className={`text-2xl font-bold ${health === 'Healthy' ? 'text-green-600' : health === 'Error' ? 'text-red-600' : 'text-gray-400'}`}>{health}</p>
                </div>
                <Activity className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Credential Types</p>
                  <p className="text-2xl font-bold text-purple-600">{credentialTypes.length}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Updated</p>
                  <p className="text-2xl font-bold text-gray-900">{lastUpdated !== 'N/A' ? new Date(lastUpdated).toLocaleDateString() : 'N/A'}</p>
                </div>
                <Globe className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botón de añadir y tabla directamente, sin tabs */}
        <div className="flex items-center justify-between mb-4">
          <div />
          <Button onClick={handleAddIssuer}>
            <Plus className="h-4 w-4 mr-2" />
            Add Trusted Issuer
          </Button>
        </div>
        <IssuerList
          issuers={issuers}
          onEdit={handleEditIssuer}
          onDelete={handleDeleteIssuer}
          onView={handleViewIssuer}
          isLoading={isLoading}
        />

        {/* Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingIssuer ? "Edit Trusted Issuer" : "Add New Trusted Issuer"}</DialogTitle>
            </DialogHeader>
            <IssuerForm
              issuer={editingIssuer}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default function TrustAnchorAdmin() {
  return (
    <NotificationProvider>
      <DashboardContent />
    </NotificationProvider>
  )
}

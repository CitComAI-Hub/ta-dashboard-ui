"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Globe, RefreshCw, ExternalLink } from "lucide-react"
import type { EBSIIssuer } from "../types/issuer"
import { apiService } from "../services/api"
import { useNotification } from "./notification"

export function EBSIRegistry() {
  const [issuers, setIssuers] = useState<EBSIIssuer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addNotification } = useNotification()

  const fetchEBSIIssuers = async () => {
    setIsLoading(true)
    const response = await apiService.getEBSIIssuers()

    if (response.error) {
      addNotification({
        type: "error",
        title: "Failed to fetch EBSI issuers",
        message: response.error,
      })
    } else if (response.data) {
      setIssuers(response.data)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchEBSIIssuers()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            EBSI Public Registry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            EBSI Public Registry ({issuers.length})
          </div>
          <Button variant="outline" size="sm" onClick={fetchEBSIIssuers} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {issuers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No EBSI issuers found</p>
            <p className="text-sm">The public registry appears to be empty</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DID</TableHead>
                  <TableHead>Credentials Supported</TableHead>
                  <TableHead>Authorization Server</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issuers.map((issuer, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm max-w-xs">
                      <div className="truncate" title={issuer.did}>
                        {issuer.did}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {issuer.credentials_supported?.slice(0, 3).map((cred, credIndex) => (
                          <Badge key={credIndex} variant="outline" className="text-xs">
                            {cred.type}
                          </Badge>
                        ))}
                        {(issuer.credentials_supported?.length || 0) > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{(issuer.credentials_supported?.length || 0) - 3} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {issuer.authorization_server ? (
                        <div className="flex items-center gap-1">
                          <span className="truncate max-w-32" title={issuer.authorization_server}>
                            {issuer.authorization_server}
                          </span>
                          <ExternalLink className="h-3 w-3 opacity-50" />
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`https://did.ebsi.eu/did/${issuer.did}`, "_blank")}
                        className="h-8 w-8 p-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

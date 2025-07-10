"use client"

import type React from "react"

import { useState } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface NotificationProps {
  id: string
  type: "success" | "error" | "info"
  title: string
  message?: string
  duration?: number
}

interface NotificationContextType {
  notifications: NotificationProps[]
  addNotification: (notification: Omit<NotificationProps, "id">) => void
  removeNotification: (id: string) => void
}

import { createContext, useContext } from "react"

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationProps[]>([])

  const addNotification = (notification: Omit<NotificationProps, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    setNotifications((prev) => [...prev, newNotification])

    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 5000)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider")
  }
  return context
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotification()

  return (
    <div className="fixed top-4 right-4 z-[1000] space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

function NotificationItem({
  notification,
  onClose,
}: {
  notification: NotificationProps
  onClose: () => void
}) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  }

  const Icon = icons[notification.type]

  return (
    <div className={`max-w-sm w-full border rounded-lg p-4 shadow-lg ${colors[notification.type]}`}>
      <div className="flex items-start">
        <Icon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium">{notification.title}</h4>
          {notification.message && <p className="mt-1 text-sm opacity-90">{notification.message}</p>}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="ml-2 h-6 w-6 p-0 hover:bg-black/10">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

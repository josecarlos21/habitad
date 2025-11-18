
"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import * as React from "react"

type SidebarContextType = {
  isSidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  isCollapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [isSidebarOpen, setSidebarOpen] = React.useState(false)
  const [isCollapsed, setCollapsed] = React.useState(false)

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen((prev) => !prev)
    } else {
      setCollapsed((prev) => !prev)
    }
  }

  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
      setCollapsed(false)
    }
  }, [isMobile])

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        setSidebarOpen,
        isCollapsed,
        setCollapsed,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

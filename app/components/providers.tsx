"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import { SessionProvider } from "./sessions"

const queryClient = new QueryClient()

export const Providers = ({ children }: { children: ReactNode }) => (
	<QueryClientProvider client={queryClient}>
		<SessionProvider>{children}</SessionProvider>
	</QueryClientProvider>
)

import { Navbar } from "@/components/layout/navbar"
import { Toaster } from "@/components/ui/toaster"
import { Outlet } from "@remix-run/react"

const PublicLayout = () => {
	return (
		<>
			<Navbar />
			<Outlet />
			<Toaster />
		</>
	)
}

export default PublicLayout

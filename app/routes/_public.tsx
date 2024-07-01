import { Navbar } from "@/components/layout/navbar"
import { Outlet } from "@remix-run/react"

const PublicLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default PublicLayout

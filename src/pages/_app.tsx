import "@/styles/globals.css"
import { Providers } from "@/components/providers"
import { AppType } from "next/app"
import { Navbar } from "@/components/layout/navbar"
import { useRouter } from "next/router"

const RootLayout: AppType = ({ Component, pageProps }) => {
	const router = useRouter()

	// don't display the navbar for login page
	if (router.pathname === "/login") {
		return (
			<Providers>
				<Component {...pageProps} />
			</Providers>
		)
	}

	return (
		<Providers>
			<Navbar />
			<Component {...pageProps} />
		</Providers>
	)
}
export default RootLayout

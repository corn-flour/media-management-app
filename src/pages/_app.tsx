import "@/styles/globals.css"
import { Providers } from "@/components/providers"
import { AppType } from "next/app"
import { Navbar } from "@/components/layout/navbar"

const RootLayout: AppType = ({ Component, pageProps }) => {
	return (
		<Providers>
			<Navbar />
			<Component {...pageProps} />
		</Providers>
	)
}
export default RootLayout

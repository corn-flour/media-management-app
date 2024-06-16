import "@/styles/globals.css"
import { Providers } from "@/components/providers"
import { AppType } from "next/app"

const RootLayout: AppType = ({ Component, pageProps }) => {
	return (
		<Providers>
			<Component {...pageProps} />
		</Providers>
	)
}
export default RootLayout

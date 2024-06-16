import "@/styles/globals.css"
import { Providers } from "@/components/providers"
import { AppType } from "next/app"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

const RootLayout: AppType = ({ Component, pageProps }) => {
	return (
		<body className={inter.className}>
			<Providers>
				<Component {...pageProps} />
			</Providers>
		</body>
	)
}
export default RootLayout

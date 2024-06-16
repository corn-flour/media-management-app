import { SearchBox } from "@/components/searchbox"

export default function Home() {
	return (
		<main className="flex h-screen w-screen flex-col items-center gap-4 p-8 md:justify-center">
			<h1 className="text-4xl">App name</h1>
			<div className="w-full max-w-lg">
				<SearchBox />
			</div>
		</main>
	)
}

import { SearchBox } from "@/components/searchbox"
import type { MetaFunction } from "@remix-run/node"

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix SPA" },
        { name: "description", content: "Welcome to Remix (SPA Mode)!" },
    ]
}

export default function Index() {
    return (
        <main className="flex h-screen w-screen flex-col items-center gap-4 p-8 md:justify-center">
            <h1 className="text-4xl">App name</h1>
            <div className="w-full max-w-lg">
                <SearchBox variant="full" />
            </div>
        </main>
    )
}

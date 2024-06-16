import { Cross1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import {
	CommandDialog,
	CommandGroup,
	CommandItem,
	CommandList,
} from "./ui/command"
import { useDebounce } from "use-debounce"
import { Command } from "cmdk"
import { useQuery } from "@tanstack/react-query"

export const SearchBox = () => {
	const [open, setOpen] = useState(false)

	// toggle search bar with shortkeys
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen((open) => !open)
			}
		}

		document.addEventListener("keydown", down)
		return () => document.removeEventListener("keydown", down)
	}, [])

	return (
		<>
			<Button
				variant="outline"
				className="relative w-full items-center justify-between rounded-full px-8 py-6"
				onClick={() => setOpen(true)}
			>
				<div className="flex items-center justify-start gap-2">
					<MagnifyingGlassIcon />
					<span className="text-muted-foreground">
						Find a movie...
					</span>
				</div>
				<kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
					<span className="text-xs">⌘</span>K
				</kbd>
			</Button>
			<SearchCommandDialog open={open} onOpenChange={setOpen} />
		</>
	)
}

type MovieQueryResult = {
	id: string
	preview: {
		title: string
		subtitle: string
		imageUrl: string
	}
}[]

const SearchCommandDialog = (props: {
	open: boolean
	onOpenChange: (open: boolean) => void
}) => {
	const [searchQuery, setSearchQuery] = useState("")
	const [debouncedQuery] = useDebounce(searchQuery, 500)

	const { data, status, fetchStatus } = useQuery({
		queryKey: ["search", debouncedQuery],
		queryFn: async ({ queryKey }) => {
			// only look for movies when the user has typed more than 3 characters
			if (!queryKey[1] || queryKey[1].length < 3) return null

			const queryParams = new URLSearchParams({
				q: queryKey[1],
			})
			console.log(
				"url",
				`https://odmeawaai.red.omg.lol/api/v0/search?${queryParams.toString()}`,
			)

			const response = await fetch(
				`https://odmeawaai.red.omg.lol/api/v0/search?${queryParams.toString()}`,
				{
					next: {
						revalidate: 3000,
					},
				},
			)

			// TODO: validate query schema
			const searchResult = (await response.json()) as MovieQueryResult
			return searchResult
		},
	})

	console.log("data", data, status, fetchStatus)

	return (
		<CommandDialog
			open={props.open}
			onOpenChange={(open) => {
				setSearchQuery("")
				props.onOpenChange(open)
			}}
			shouldFilter={false}
		>
			<div
				className="flex items-center border-b px-3"
				cmdk-input-wrapper=""
			>
				<MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
				<input
					className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>
			{status === "pending" ? (
				<div className="flex items-center gap-2 border-t p-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="animate-spin"
					>
						<path d="M21 12a9 9 0 1 1-6.219-8.56" />
					</svg>
					<span>Searching...</span>
				</div>
			) : status === "error" ? (
				<div className="flex items-center gap-2 border-t p-4 text-red-500">
					<Cross1Icon />
					<span>An error has occurred.</span>
				</div>
			) : !!data ? (
				data.length ? (
					<CommandList>
						<CommandGroup>
							{data.map((movie) => (
								<CommandItem key={movie.id} className="gap-2">
									{movie.preview.imageUrl !== "N/A" ? (
										<picture>
											<img
												src={movie.preview.imageUrl}
												alt={`Poster image for ${movie.preview.title}`}
												width={50}
												height={50}
												className="aspect-square rounded-sm object-cover"
											/>
										</picture>
									) : (
										<div className="h-[50px] w-[50px] rounded-sm bg-muted"></div>
									)}
									<span>{movie.preview.title}</span>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				) : (
					<Command.Empty className="p-4 text-muted-foreground">
						No movies found.
					</Command.Empty>
				)
			) : null}
		</CommandDialog>
	)
}

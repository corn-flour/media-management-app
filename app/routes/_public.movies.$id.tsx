import { RatingDialog } from "@/components/ratings/dialog"
import { Button } from "@/components/ui/button"
import { HeartIcon } from "@radix-ui/react-icons"
import { useLoaderData } from "@remix-run/react"
import { useQuery } from "@tanstack/react-query"

type MovieDetail = {
	Title: string
	Year: string
	Plot: string
	Poster: string
}

export const clientLoader = async ({
	params,
}: {
	params: {
		id: string
	}
}) => {
	return params
}

const MovieResultPage = () => {
	const clientLoaderData = useLoaderData<typeof clientLoader>()
	const id = clientLoaderData.id

	const { data, status, error } = useQuery({
		queryKey: ["search", id],
		queryFn: async () => {
			if (!id || typeof id !== "string") {
				throw new Error("Invalid ID")
			}

			const response = await fetch(
				`https://odmeawaai.red.omg.lol/api/v0/item/${id}`,
			)
			const data = await response.json()

			return data as MovieDetail
		},
	})

	// mock data for layout only, since there is no get by id endpoint yet
	return (
		<main>
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
				<p className="text-destructive">{error.message}</p>
			) : (
				<>
					<div className="h-80 w-full bg-primary" />
					<div className="relative -mt-40 px-2">
						<div className="container mx-auto flex items-end gap-8">
							<picture>
								<img
									src={data.Poster}
									alt={`Poster for ${data.Title}`}
									className="aspect-[10/16] w-[225px] object-contain"
								/>
							</picture>
							<div>
								<h1 className="text-3xl">{data.Title}</h1>
								<p className="text-lg">{data.Year}</p>

								<div className="mt-4 flex gap-2">
									<RatingDialog id={id} name={data.Title} />
									<Button
										variant="secondary"
										size="icon"
										className="bg"
									>
										<HeartIcon />
									</Button>
								</div>
							</div>
						</div>
					</div>

					<div className="container mx-auto mt-16">
						<h2 className="text-lg font-bold">Synopsis</h2>
						<p>{data.Plot}</p>
					</div>
				</>
			)}
		</main>
	)
}

export default MovieResultPage

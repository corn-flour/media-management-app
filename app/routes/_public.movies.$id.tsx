/* eslint-disable no-mixed-spaces-and-tabs */
import { useRatings } from "@/components/providers/ratings"
import { useSession } from "@/components/providers/sessions"
import { RatingDialog } from "@/components/ratings/add-rating-dialog"
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

	const { agent } = useSession()

	const { ratings } = useRatings()
	const rkey = ratings[id]

	const mediaInfo = useQuery({
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

	const userDid = agent.session?.did

	const ratingInfo = useQuery({
		queryKey: ["ratings", id],
		queryFn: async () => {
			if (!id || typeof id !== "string") {
				throw new Error("Invalid ID")
			}

			const response = await agent.com.atproto.repo.getRecord({
				repo: userDid!,
				collection: "org.example.media.rating",
				rkey,
			})

			if (!response.success) throw new Error("Failed to get ratings")

			// TODO: figure out how to add types to OutputSchema.value
			return response.data as unknown as {
				value: {
					score: number
				}
			}
		},

		// only run this query if the user is signed in and has added a rating
		enabled: !!rkey && !!userDid,
	})

	// mock data for layout only, since there is no get by id endpoint yet
	return (
		<main>
			{mediaInfo.status === "pending" ? (
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
			) : mediaInfo.status === "error" ? (
				<p className="text-destructive">{mediaInfo.error.message}</p>
			) : (
				<>
					<div className="h-80 w-full bg-primary" />
					<div className="relative -mt-40 px-2">
						<div className="container mx-auto flex items-end gap-8">
							<picture>
								<img
									src={mediaInfo.data.Poster}
									alt={`Poster for ${mediaInfo.data.Title}`}
									className="aspect-[10/16] w-[225px] object-contain"
								/>
							</picture>
							<div>
								<h1 className="text-3xl">
									{mediaInfo.data.Title}
								</h1>
								<p className="text-lg">{mediaInfo.data.Year}</p>

								<div className="mt-4 flex items-center gap-2">
									{/* TODO: add edit dialog */}
									{ratingInfo.status === "success" ? (
										<Button>Edit rating</Button>
									) : (
										<RatingDialog
											id={id}
											name={mediaInfo.data.Title}
										/>
									)}
									<Button
										variant="secondary"
										size="icon"
										className="bg"
									>
										<HeartIcon />
									</Button>
									{!rkey ? null : ratingInfo.status ===
									  "pending" ? (
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
									) : ratingInfo.status === "error" ? (
										<p className="text-destructive">
											{ratingInfo.error.message}
										</p>
									) : (
										<p>
											Your rating:{" "}
											{ratingInfo.data?.value.score}/100
										</p>
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="container mx-auto mt-16">
						<h2 className="text-lg font-bold">Synopsis</h2>
						<p>{mediaInfo.data.Plot}</p>
					</div>
				</>
			)}
		</main>
	)
}

export default MovieResultPage

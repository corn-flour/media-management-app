import { Button } from "@/components/ui/button"
import { HeartIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/router"

const MovieResultPage = () => {
	const router = useRouter()
	const id = router.query.id

	// mock data for layout only, since there is no get by id endpoint yet
	return (
		<main>
			<div className="h-80 w-full bg-primary" />
			<div className="relative -mt-40 px-2">
				<div className="container mx-auto flex items-end gap-8">
					<picture>
						<img
							src="https://m.media-amazon.com/images/M/MV5BNDVhMjFiY2UtMzAwMC00MTYyLWI3NTAtZWVkYjVlNzgzYjUxXkEyXkFqcGdeQXVyNTc3MDU1MTU@._V1_SX300.jpg"
							alt={`Poster for Sound! Euphonium`}
							className="aspect-[10/16] w-[225px] object-contain"
						/>
					</picture>
					<div>
						<h1 className="text-3xl">Sound! Euphonium</h1>
						<p className="text-lg">2015</p>

						<div className="mt-4 flex gap-2">
							<Button>Add to list</Button>
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
				<p>
					Spring in the first year of high school. Kumiko, a member of
					the brass band in junior high school, visits the high school
					brass band club with classmates Hazuki and Sapphire. There,
					she comes across Reina, her former classmate from junior
					high. Hazuki and Sapphire decide to join the club, but
					Kumiko can’t make up her mind. She recollects her experience
					with Reina at a competition in junior high school.
				</p>
			</div>
		</main>
	)
}

export default MovieResultPage

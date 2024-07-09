import { useSession } from "@/components/providers/sessions"
import { useLoaderData } from "@remix-run/react"
import { useQuery } from "@tanstack/react-query"

export const clientLoader = async ({
	params,
}: {
	params: {
		id: string
	}
}) => {
	return params
}

const UserProfilePage = () => {
	const clientLoaderData = useLoaderData<typeof clientLoader>()
	const id = clientLoaderData.id
	const { agent } = useSession()

	const { data, status } = useQuery({
		queryKey: ["userProfile", id],
		queryFn: async ({ queryKey }) => {
			const response = await agent?.getProfile({
				actor: queryKey[1],
			})
			if (!response?.success) throw new Error("Failed to get user data")
			return response?.data
		},
	})

	// TODO: handle these
	if (status === "pending") return <div>Loading...</div>
	if (status === "error") return <div>Error!</div>

	return (
		<main>
			<div className="relative">
				{data.banner ? (
					<img
						src={data.banner}
						className="h-64 w-full object-cover"
						alt={`banner of ${data.displayName}`}
					/>
				) : (
					<div className="h-64 w-full bg-muted" />
				)}
				<div className="container absolute left-1/2 top-56 mx-auto flex -translate-x-1/2 items-center justify-start gap-8">
					<div className="rounded-full bg-background p-1.5">
						<img
							src={data.avatar}
							alt={`Avatar of ${data.displayName}`}
							className="h-36 w-36 rounded-full"
						/>
					</div>
					<div>
						<h1 className="text-3xl font-bold">
							{data.displayName}
						</h1>
						<p className="text-muted-foreground">{data.handle}</p>
					</div>
				</div>
			</div>
		</main>
	)
}

export default UserProfilePage

import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import { useSession } from "../sessions"
import { useMutation } from "@tanstack/react-query"
import { AtUri } from "@atproto/api"
import { useToast } from "../ui/use-toast"
import { useRatings } from "../providers/ratings"

const ratingFormValidator = z.object({
	rating: z.coerce.number().int().min(0).max(100),
})

type RatingFormFields = z.infer<typeof ratingFormValidator>

export const RatingDialog = (props: { id: string; name: string }) => {
	const [modalOpen, setModalOpen] = useState(false)
	const form = useForm({
		resolver: zodResolver(ratingFormValidator),
		defaultValues: {
			rating: 0,
		},
	})
	const { agent } = useSession()
	const { toast } = useToast()
	const { addRating } = useRatings()

	const { mutate, status } = useMutation({
		mutationFn: async (props: { mediaId: string; rating: number }) => {
			const userDid = agent?.session?.did
			if (!agent || !userDid) throw new Error("You are not signed in")
			const response = await agent.com.atproto.repo.createRecord({
				repo: userDid,
				collection: "org.example.media.rating",
				validate: false,
				record: {
					$type: "org.example.media.rating",
					createdAt: new Date().toISOString(),
					subject: `:${props.mediaId}`,
					score: props.rating,
				},
			})

			if (!response.success) throw new Error("Failed to add rating")

			console.log("created record", response.data.cid, response.data.uri)
			return response.data
		},
		onError: (error) => {
			toast({ title: error.message, variant: "destructive" })
		},

		onSuccess: (data) => {
			const atUri = new AtUri(data.uri)
			addRating(props.id, atUri.rkey)
			setModalOpen(false)
			toast({ title: "Successfully added rating" })
		},
	})

	const onSubmit: SubmitHandler<RatingFormFields> = async (data) => {
		mutate({
			mediaId: props.id,
			rating: data.rating,
		})
	}

	return (
		<Dialog open={modalOpen} onOpenChange={setModalOpen}>
			<DialogTrigger asChild>
				<Button>Add to list</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{props.name}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="rating"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Score</FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											disabled={status === "pending"}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<Button type="submit" disabled={status === "pending"}>
							Save
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

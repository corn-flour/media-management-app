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

const ratingFormValidator = z.object({
	id: z.string(),
	rating: z.coerce.number().int().min(0).max(100),
})

type RatingFormFields = z.infer<typeof ratingFormValidator>

export const RatingDialog = (props: { id: string; name: string }) => {
	const [modalOpen, setModalOpen] = useState(false)
	const form = useForm({
		resolver: zodResolver(ratingFormValidator),
		defaultValues: {
			id: `:${props.id}`,
			rating: 0,
		},
	})

	const onSubmit: SubmitHandler<RatingFormFields> = (data) => {
		// TODO:
		alert("submitted")
		console.log("submit rating", data)
		setModalOpen(false)
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
							name="id"
							render={({ field }) => (
								<input type="hidden" value={field.value} />
							)}
						/>
						<FormField
							control={form.control}
							name="rating"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Score</FormLabel>
									<FormControl>
										<Input type="number" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<Button type="submit">Save</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

import { useSession } from "@/components/sessions"
import { Button } from "@/components/ui/button"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/router"
import { useState } from "react"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
const loginSchema = z.object({
	service: z.string().url(),
	identifier: z.string(),
	password: z.string(),
})

type LoginFormFields = z.infer<typeof loginSchema>

const LoginPage = () => {
	const { login } = useSession()
	const router = useRouter()
	const [submissionError, setSubmissionError] = useState("")

	const form = useForm<LoginFormFields>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			service: "https://bsky.social",
		},
	})

	const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
		try {
			await login(data)
			router.push("/")
		} catch (e) {
			setSubmissionError((e as Error).message)
		}
	}

	return (
		<div className="grid h-screen place-content-center p-4">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-[80vw] max-w-md space-y-4 rounded-lg border p-8"
				>
					<FormField
						control={form.control}
						name="service"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Service</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="identifier"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Identifier</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input {...field} type="password" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Log in</Button>
				</form>
			</Form>
		</div>
	)
}

export default LoginPage

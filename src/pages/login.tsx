import { useSession } from "@/components/sessions"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const LoginPage = () => {
	const [data, setData] = useState({
		service: "",
		identifier: "",
		password: "",
	})

	const { login } = useSession()

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await login(data)
			}}
			className="flex flex-col gap-4 p-8"
		>
			<input
				name="service"
				value={data.service}
				onChange={(e) =>
					setData((data) => ({
						...data,
						service: e.target.value,
					}))
				}
				className="border"
			/>
			<input
				name="identifier"
				value={data.identifier}
				onChange={(e) =>
					setData((data) => ({
						...data,
						identifier: e.target.value,
					}))
				}
				className="border"
			/>
			<input
				type="password"
				name="password"
				value={data.password}
				onChange={(e) =>
					setData((data) => ({
						...data,
						password: e.target.value,
					}))
				}
				className="border"
			/>
			<Button type="submit">Login</Button>
		</form>
	)
}

export default LoginPage

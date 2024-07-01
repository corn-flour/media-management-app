import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react"
import { BskyAgent, AtpSessionData } from "@atproto/api"

type SessionContext = {
	login: (props: {
		service: string
		identifier: string
		password: string
	}) => Promise<void>
	logout: () => void
	agent: BskyAgent | null
}

const SessionContext = createContext<SessionContext>({
	login: async () => {},
	logout: () => {},
	agent: null,
})

export const SessionProvider = ({ children }: { children: ReactNode }) => {
	const [agent, setAgent] = useState<BskyAgent | null>(null)

	// sign in to an ATP account
	const login = async (props: {
		service: string
		identifier: string
		password: string
	}) => {
		const agent = new BskyAgent({
			service: props.service,
		})
		await agent.login({
			identifier: props.identifier,
			password: props.password,
		})
		setAgent(agent)
	}

	// log out of an ATP account
	const logout = () => {
		setAgent(null)
		localStorage.removeItem("service")
		localStorage.removeItem("agentService")
	}

	// if there is session in localstorage, retrieve it and create new agent
	useEffect(() => {
		const resumeSession = async () => {
			const agentSession = localStorage.getItem("agentSession")
			const service = localStorage.getItem("service")
			if (agentSession && service) {
				const sessionObj = JSON.parse(agentSession) as AtpSessionData
				const agent = new BskyAgent({
					service,
				})
				await agent.resumeSession(sessionObj)
				console.log("resuming session:", agent.session?.handle)
				setAgent(agent)
			}
		}
		if (typeof window !== undefined) {
			resumeSession()
		}
	}, [])

	// set agent session to localstorage for persisting log in
	useEffect(() => {
		if (typeof window !== undefined && agent?.session && agent?.service) {
			localStorage.setItem("agentSession", JSON.stringify(agent.session))
			localStorage.setItem("service", agent.service.toString())
		}
	}, [agent?.session, agent?.service])

	return (
		<SessionContext.Provider
			value={{
				agent,
				login,
				logout,
			}}
		>
			{children}
		</SessionContext.Provider>
	)
}

export const useSession = () => {
	const session = useContext(SessionContext)
	const isLoggedIn = !!session.agent
	return {
		...session,
		isLoggedIn,
	}
}

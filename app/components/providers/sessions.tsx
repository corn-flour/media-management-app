import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react"
import { BskyAgent, AtpSessionData } from "@atproto/api"

const publicAgent = new BskyAgent({
	service: "https://public.api.bsky.app",
})

type SessionContext = {
	login: (props: {
		service: string
		identifier: string
		password: string
	}) => Promise<void>
	logout: () => void
	agent: BskyAgent
}

const SessionContext = createContext<SessionContext>({
	login: async () => {},
	logout: () => {},
	agent: publicAgent,
})

export const SessionProvider = ({ children }: { children: ReactNode }) => {
	const [agent, setAgent] = useState<BskyAgent>(publicAgent)

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
		setAgent(publicAgent)
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
				setAgent(agent)
			}
		}

		resumeSession()
	}, [])

	// set agent session to localstorage for persisting log in
	useEffect(() => {
		if (agent.session) {
			localStorage.setItem("agentSession", JSON.stringify(agent.session))
			localStorage.setItem("service", agent.service.toString())
		}
	}, [agent.session, agent.service])

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
	const isLoggedIn = !!session.agent.session
	return {
		...session,
		isLoggedIn,
	}
}

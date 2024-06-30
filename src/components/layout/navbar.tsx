import { PersonIcon } from "@radix-ui/react-icons"
import { Button } from "../ui/button"
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "../ui/navigation-menu"
import Link from "next/link"
import { SearchBox } from "../searchbox"
import { useSession } from "../sessions"
import { useQuery } from "@tanstack/react-query"

const navItems = [
	{
		url: "/",
		title: "Home",
	},
	{
		url: "/browse",
		title: "Browse",
	},
]

export const Navbar = () => {
	return (
		<header className="sticky top-0 border-b bg-background p-4">
			<div className="container mx-auto flex items-center justify-between">
				<Link href="/">LOGO</Link>

				<div className="flex items-center gap-2">
					<NavigationMenu>
						<NavigationMenuList>
							{navItems.map((navItem) => (
								<NavigationMenuItem key={navItem.url}>
									<Link
										href={navItem.url}
										legacyBehavior
										passHref
									>
										<NavigationMenuLink
											className={navigationMenuTriggerStyle()}
										>
											{navItem.title}
										</NavigationMenuLink>
									</Link>
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
					<SearchBox variant="icon" />
					<ProfileButton />
				</div>
			</div>
		</header>
	)
}

const ProfileButton = () => {
	const { isLoggedIn, agent, logout } = useSession()
	const { data, status } = useQuery({
		queryKey: ["user-profile", agent?.session?.did],
		queryFn: async ({ queryKey }) => {
			const response = await agent?.getProfile({
				actor: agent.session!.did,
			})
			return response
		},
	})

	if (!isLoggedIn) {
		return (
			<Button asChild>
				<Link href="/login">Log In</Link>
			</Button>
		)
	}

	// TODO: handle log out
	return (
		<Button size="icon" variant="secondary" className="rounded-full border">
			{status === "pending" ? (
				<>
					<PersonIcon />
				</>
			) : status === "error" ? (
				<>
					<PersonIcon />
				</>
			) : (
				<>
					<picture>
						<img
							src={data?.data.avatar}
							alt={`${data?.data.displayName}'s avatar`}
							className="rounded-full"
							width={34}
							height={34}
						/>
					</picture>
				</>
			)}
		</Button>
	)
}

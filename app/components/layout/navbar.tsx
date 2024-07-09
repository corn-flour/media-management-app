import { PersonIcon } from "@radix-ui/react-icons"
import { Button } from "../ui/button"
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "../ui/navigation-menu"
import { SearchBox } from "../searchbox"
import { useSession } from "../providers/sessions"
import { useQuery } from "@tanstack/react-query"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Link, useNavigate } from "@remix-run/react"

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
				<Link to="/">LOGO</Link>

				<div className="flex items-center gap-2">
					<NavigationMenu>
						<NavigationMenuList>
							{navItems.map((navItem) => (
								<NavigationMenuItem key={navItem.url}>
									<NavigationMenuLink
										className={navigationMenuTriggerStyle()}
										asChild
									>
										<Link to={navItem.url}>
											{navItem.title}
										</Link>
									</NavigationMenuLink>
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
		queryFn: async () => {
			const response = await agent?.getProfile({
				actor: agent.session!.did,
			})
			return response
		},
		enabled: !!agent,
	})
	const navigate = useNavigate()

	if (!isLoggedIn) {
		return (
			<Button asChild>
				<Link to="/login">Log In</Link>
			</Button>
		)
	}

	if (status === "pending") {
		return <PersonIcon className="rounded-full border" />
	}

	if (status === "error") {
		logout()
		navigate("/login")
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="rounded-full">
				<img
					src={data?.data.avatar}
					alt={`${data?.data.displayName}'s avatar`}
					className="rounded-full"
					width={34}
					height={34}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => {
							console.log("profile option clicked")
							navigate(`/profile/${data?.data.handle}`)
						}}
					>
						My Profile
					</DropdownMenuItem>
					<DropdownMenuItem disabled>Preferences</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						logout()
						navigate("/login")
					}}
					className="focus:bg-destructive/30"
				>
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

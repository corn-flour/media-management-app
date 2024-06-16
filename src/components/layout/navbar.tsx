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
					<Button
						size="icon"
						variant="secondary"
						className="rounded-full border"
					>
						<PersonIcon className="h-6 w-6" />
						<span className="sr-only">Search</span>
					</Button>
				</div>
			</div>
		</header>
	)
}

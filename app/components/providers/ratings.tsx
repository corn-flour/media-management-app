import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

// This is temporary used since there is no Appview API to fetch a rating record given the media id yet
// we store a {mediaID: rkey} map which is the map of the media id to the record key of the rating record of the user,
// which we can then use to get the rating record itself
// this will break if multiple users use the same browser, but i hope there will be an appview API for this before then 😅
const ratingAtom = atomWithStorage("ratings", JSON.stringify(""))
export const useRatings = () => {
	const [ratingString, setRatingString] = useAtom(ratingAtom)

	const ratings = JSON.parse(ratingString) as Record<string, string>
	const addRating = (mediaId: string, rkey: string) => {
		const newRatings = {
			...ratings,
			[mediaId]: rkey,
		}
		setRatingString(JSON.stringify(newRatings))
	}
	const removeRating = (mediaId: string) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const newRatings = { ...ratings }
		delete newRatings[mediaId]
		setRatingString(JSON.stringify(newRatings))
	}

	return {
		ratings,
		addRating,
		removeRating,
	}
}

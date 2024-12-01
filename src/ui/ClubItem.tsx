import "../style/ui/club.scss";
import {useEffect, useState} from "react";

type IProps = {
	name: string,
	id: string,
	joinToTheClub: (id: string) => void,
	allMyClubs: string[]
}

export const ClubItem = ({name, id, joinToTheClub, allMyClubs}: IProps) => {
	const [isIncludes, setIsIncludes] = useState<boolean>(false);

	useEffect(() => {
		if (allMyClubs.includes(id)) {
			setIsIncludes(true)
		}
	}, []);

	const joinToTheClubHandler = (id: string) => {
		setIsIncludes(true)
		joinToTheClub(id)
	}

	return (
		<>

			<div className="club-item">
				<div className="club-item__avatar">{name ? name[0].toUpperCase() : "A"}</div>
				<div className="club-item__content">
					<div className="club-item__name">{name}</div>
					<div onClick={() => joinToTheClubHandler(id)} className="club-item__button">
						{
							isIncludes ? 'Вы участник' : 'Вступить'
						}
					</div>
				</div>
			</div>

		</>
	);
};
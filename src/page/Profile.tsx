import {useAppDispatch, useAppSelector} from "../hook/redux";
import {logoutSuccess} from "../redux/reducer/userSlice";
import {useNavigate} from "react-router-dom";

export const Profile = () => {
	const {isAuth} = useAppSelector(state => state.user);
	const dispatch = useAppDispatch()

	const navigation = useNavigate()

	const logout = () => {
		localStorage.removeItem("token");
		dispatch(logoutSuccess())
		navigation('/login')
	};

	return (
		<>
			{
				isAuth ? <button onClick={logout}>Выйти</button> : null
			}
		</>
	)
}
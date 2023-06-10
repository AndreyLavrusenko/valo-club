import logo from "../assets/images/logo.svg";
import "../style/components/header.scss";
import {NavLink} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {useWakeLock} from "react-screen-wake-lock";

type IProps = {
	isTrainer: boolean
	setIsTrainer: Function
}

export const Header = ({isTrainer, setIsTrainer}: IProps) => {
	const ref = useRef<HTMLInputElement>(null);
	const nav = useRef<HTMLInputElement>(null);

	const [isScreenLock, setIsScreenLock] = useState(false);

	const { released, request, release } = useWakeLock({
		onRequest: () => setIsScreenLock(true),
		onRelease: () => setIsScreenLock(false),
	});

	useEffect(() => {
		window.addEventListener("click",  handleClose);

		return () => window.removeEventListener("click", handleClose);
	}, []);

	const hideBurgerHandler = () => {
		if (ref.current) {
			ref.current.checked = false;
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		setIsTrainer(false);

		if (ref.current) {
			ref.current.checked = false;
		}
	};

	const handleClose = (e: any) => {

		if (!e.target.closest('nav')) {
			if (ref.current) {
				if (!ref.current.checked) {
					if (e.target.closest('.checkbox-main')) {
						ref.current.checked = true
						if (nav.current) {
							nav.current.style.left = "30%"
							nav.current.style.boxShadow = "-30px 20px 33px rgba(0, 0, 0, 0.07)"
						}
					} else {
						ref.current.checked = false
						if (nav.current) {
							nav.current.style.left = "100%"
							nav.current.style.boxShadow = "none"
						}
					}
				} else {
					ref.current.checked = false
					if (nav.current) {
						nav.current.style.left = "100%"
						nav.current.style.boxShadow = "none"
					}
				}
			}
		}

	};

	return (
		<>
			<header className="header">
				<div className="header__content">
					<NavLink to={"/"}>
						<img src={logo} alt="Вело Клуб 47"/>
					</NavLink>
					<div className="header__burger">
						<div className="checkbox-main">
							<input ref={ref} id="toggle" type="checkbox"></input>

							<label htmlFor="toggle" className="hamburger">
								<div className="top-bun"></div>
								<div className="meat"></div>
								<div className="bottom-bun"></div>
							</label>
						</div>
						<div className="nav" ref={nav}>
							<div className="nav-wrapper">
								<nav>
									<div>
										{isTrainer
											? <NavLink to={"/create-workout"} onClick={hideBurgerHandler}>
												<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
													<g clipPath="url(#clip0_64_3033)">
														<path d="M1.46541 2.11567C1.3453 2.18573 1.19517 2.33586 1.12511 2.45597C1.01501 2.64113 1 2.73121 1 3.12155C1 4.5478 1.6856 5.95904 2.83661 6.88986C3.44715 7.38529 3.94258 7.6205 5.00351 7.93077C5.12362 7.9658 5.13363 8.01084 5.48393 10.1177C5.68411 11.3037 5.82924 12.2846 5.80922 12.2996C5.79421 12.3146 5.6691 12.3697 5.52897 12.4197C4.72327 12.71 3.84249 13.2705 3.1669 13.911C2.55637 14.4965 2.12599 15.077 1.75066 15.8077C1.22019 16.8586 1 17.7844 1 19.0005C1 20.2165 1.22019 21.1424 1.75066 22.1933C2.76155 24.18 4.63319 25.5512 6.86014 25.9366C7.22546 25.9966 8.36646 26.0066 14.9172 25.9966L22.5439 25.9816L22.9443 25.8665C24.8259 25.331 26.2672 23.7246 26.5724 21.838C26.6625 21.2875 26.6125 20.1865 26.4774 19.6761C26.2221 18.7252 25.5565 17.7144 24.7709 17.0838C24.0752 16.5283 23.6198 16.3381 21.2928 15.6425C20.1668 15.3072 19.236 15.027 19.231 15.027C19.221 15.022 20.4421 6.43946 20.4921 6.14921L20.5221 5.98406L22.1836 5.99908C23.77 6.01409 23.855 6.01909 24.0452 6.11918C24.4005 6.30935 24.5707 6.5946 24.5707 6.98994C24.5707 7.55044 24.2254 7.89073 23.5948 7.9658C22.9693 8.04087 22.619 8.40619 22.619 8.9917C22.619 9.39205 22.7741 9.68231 23.0894 9.86747C23.2695 9.97256 23.3646 9.99258 23.6899 9.99258C24.4756 9.99258 25.1812 9.69732 25.7517 9.12181C26.3422 8.5313 26.6225 7.8507 26.6225 6.98994C26.6225 6.73472 26.5874 6.39442 26.5424 6.22427C26.2722 5.18336 25.4264 4.33762 24.3855 4.06738C24.1253 3.99732 23.6098 3.98731 20.6873 3.98731H17.2993L17.0841 4.11242C16.7688 4.29758 16.6137 4.58784 16.6137 4.98819C16.6137 5.38854 16.7688 5.67879 17.0841 5.86396C17.2793 5.97906 17.3493 5.98907 17.8548 5.98907C18.1651 5.98907 18.4153 6.00408 18.4153 6.0241C18.4253 6.15922 17.2392 14.3314 17.2092 14.3664C17.1892 14.3864 15.4777 13.896 13.4009 13.2755C11.3291 12.6549 9.4324 12.1094 9.18718 12.0694C8.94197 12.0294 8.55162 11.9943 8.31141 11.9943H7.88104L7.56576 10.0777C7.39061 9.02673 7.23547 8.12594 7.22546 8.0759C7.20044 7.99583 7.29552 7.99082 8.76181 7.99082H10.3232L10.5384 7.86571C10.8536 7.68055 11.0088 7.3903 11.0088 6.98994C11.0088 6.58959 10.8536 6.29934 10.5434 6.11918L10.3332 5.99407L7.93108 5.97906C5.59403 5.95904 5.51896 5.95404 5.17867 5.84394C4.71326 5.6888 4.35795 5.48362 4.00263 5.15333C3.42212 4.61786 3.13687 4.02735 3.0468 3.17159C2.98174 2.56106 2.85663 2.30083 2.53134 2.11066C2.22608 1.93551 1.76567 1.93551 1.46541 2.11567ZM8.87691 14.1012C9.40738 14.1963 22.634 18.1948 22.9693 18.3599C23.1945 18.47 23.4147 18.6402 23.6949 18.9204C24.3104 19.541 24.5707 20.1615 24.5707 21.0022C24.5707 21.7679 24.3205 22.4235 23.815 22.974C23.4397 23.3843 23.0594 23.6345 22.5189 23.8247L22.0935 23.9798L15.2125 23.9949C8.04118 24.0099 7.40562 23.9949 6.705 23.8047C5.30878 23.4144 4.11774 22.4035 3.49719 21.0823C3.14688 20.3316 3.07682 19.9914 3.07682 19.0255C3.07682 18.2949 3.09184 18.1147 3.19192 17.7494C3.45716 16.7635 4.10272 15.7777 4.88841 15.1471C5.27875 14.8318 6.11949 14.3414 6.17454 14.3964C6.19956 14.4265 6.50483 16.188 6.50483 16.3081C6.50483 16.3432 6.40975 16.4282 6.29965 16.4983C5.7892 16.8086 5.24873 17.5792 5.07858 18.2348C4.97849 18.6101 4.98349 19.3808 5.08358 19.7662C5.35382 20.8071 6.19956 21.6528 7.24047 21.923C7.63082 22.0281 8.38148 22.0281 8.77182 21.923C9.13714 21.828 9.55751 21.6228 9.87278 21.3826L10.108 21.2024L10.9087 21.6028L11.7094 22.0031H13.0205H14.3267L14.5419 21.878C14.8572 21.6928 15.0123 21.4026 15.0123 21.0022C15.0123 20.6019 14.8572 20.3116 14.5419 20.1265C14.3317 20.0064 14.3067 20.0014 13.3158 20.0014H12.3099L11.6594 19.6761L11.0088 19.3508V18.9354C11.0088 18.1397 10.7235 17.4591 10.133 16.8686C9.75768 16.4933 9.13213 16.128 8.7518 16.0679C8.58666 16.0379 8.55663 16.0129 8.53161 15.8777C8.51659 15.7927 8.43652 15.3473 8.36146 14.8819L8.22133 14.0461H8.4065C8.50659 14.0461 8.71677 14.0712 8.87691 14.1012ZM8.44653 18.1447C8.78183 18.3149 8.95698 18.6101 8.95698 19.0005C8.95698 19.556 8.56163 19.9513 8.00615 19.9513C7.45066 19.9513 7.05531 19.556 7.05531 19.0005C7.05531 18.445 7.44065 18.0547 7.99614 18.0496C8.16128 18.0496 8.33143 18.0847 8.44653 18.1447Z" fill="#AEAEB1"/>
													</g>
													<defs>
														<clipPath id="clip0_64_3033">
															<rect width="28" height="28" fill="white"/>
														</clipPath>
													</defs>
												</svg>

												Создание тренировки
											</NavLink>
											: null
										}
										<div>
											<button
												type="button"
												className={isScreenLock ? "button-lock" : "button-lock-outline"}
												onClick={() => (released === false ? release() : request())}
											>
												{released === false ? "Блокировать экран" : "Не блокировать экран"}
											</button>
										</div>
									</div>
									<div>
										{isTrainer
											? <NavLink to={"/"} onClick={logout}>Выйти</NavLink>
											: <NavLink to={"/login"} onClick={hideBurgerHandler}>Войти как тренер</NavLink>
										}
									</div>
								</nav>
							</div>
						</div>
					</div>
				</div>
			</header>
		</>
	);
};
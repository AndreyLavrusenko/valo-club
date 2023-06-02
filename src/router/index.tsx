export interface IRouter {
    path: string,
    component: JSX.Element,
}

export const enum RoutNames {
    LOGIN = '/login',
    HOME = '/'
}


export const publicRoutes: IRouter[] = [
    // {path: RoutNames.HOME, component: <Login />},
    // {path: RoutNames.LOGIN, component: <Login />}
]

export const privateRoutes: IRouter[] = [
    // {path: RoutNames.HOME, component: <Event />}
]
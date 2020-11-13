import LoginContainer from '../../features/login/containers/LoginContainers';
import JoinGameContainer from '../../features/joingame/containers/JoinGameContainers';

const routes = [
    {
        path: "/login",
        key: 'login',
        component: LoginContainer,
        routes: []
    },
    {
        path: "/lobby",
        component: JoinGameContainer,
        key: 'lobby',
        routes: []
    },
    // {
    //     path: "*",
    //     component: NotFound,
    //     routes: []
    // },
    
]


export default routes;
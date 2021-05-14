import {LOGIN_ROUTE, CHAT_ROUTE} from "./utils/consts";
import Login from "../components/Login";
import Chat from "../components/Chat";


export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Components: Login
    }
]

export const privateRoutes = [
    {
        path: CHAT_ROUTE,
        Components: Chat
    }
]
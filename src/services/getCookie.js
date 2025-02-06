import Cookies from 'js-cookie';

export const getCookie = (cookieName) => {
    const cookie = Cookies.get(cookieName);
    if (!cookie) {
        return null;
    }
    return cookie;
};
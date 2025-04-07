import { AuthorizationAPI } from '../api';
import Cookies from 'js-cookie';

async function LogOutFetchAsync() {
    try {
        const response = await fetch(`${AuthorizationAPI}/Account/log-out`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });

        if (response.ok) {
            Cookies.remove('isLoggedIn');
            window.location.href = "/";
        } else {
            var result = await response.json();
            console.error(result);
        }
    } catch (error) {
        console.error('Error during sign out:', error);
    }
}

export default LogOutFetchAsync;
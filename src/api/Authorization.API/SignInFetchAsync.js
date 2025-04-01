import { AuthorizationAPI } from '../api';
import Cookies from 'js-cookie';

async function SignInFetchAsync(signInModel) {
    try {
        const response = await fetch(`${AuthorizationAPI}/Account/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email: signInModel.email,  password: signInModel.password })
        });

        if (response.ok) {
            alert("You've signed in successfully");
            Cookies.set('isLoggedIn', true, { 
                sameSite: 'strict',  
                path: '/',
                expires: 7,
                domain: 'localhost'
            });
            window.location.href = "/";
        } else if (response.status === 401 || response.result === 404) {
            var result = await response.json();
            alert(result.error);
        }
    } catch (error) {
        console.error('Error during sign in:', error);
    }
}

export default SignInFetchAsync;
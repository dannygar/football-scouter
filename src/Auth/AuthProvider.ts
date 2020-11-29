import { CacheLocation } from 'msal';
import { MsalAuthProvider, LoginType } from 'react-aad-msal';

// Msal Configurations
const config = {
    auth: {
        authority: 'https://login.microsoftonline.com/common',
        clientId: process.env.REACT_APP_CLIENT_APP_ID ?? 'must provide app client id',
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        navigateToLoginRequestUrl: true,
        validateAthority: true
    },
    cache: {
        cacheLocation: "localStorage" as CacheLocation,
        storeAuthStateInCookie: true
    }
};
 
// Authentication Parameters
const authenticationParameters = {
    scopes: [
        `${process.env.REACT_APP_CLIENT_APP_ID}/.default`
    ]
}

// export const authenticationParametersGraph = {
//     scopes: [
//         'openid'
//     ]
// }
 
// Options
const options = {
    loginType: LoginType.Redirect,
    tokenRefreshUri: window.location.origin
}
 
export const authProvider = new MsalAuthProvider(config, authenticationParameters, options)
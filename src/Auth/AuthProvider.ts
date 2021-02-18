import { CacheLocation } from 'msal';
import React from 'react';
import { MsalAuthProvider, LoginType } from 'react-aad-msal';
import { Agent } from '../Models/Agent';

// Msal Configurations
const config = {
    auth: {
        //authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
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
        `${process.env.REACT_APP_API_ID}/.default`,
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

// Create a auth global context
export interface IAuthContext {
    authUser: Agent
    onSignInOutClicked: () => void
}
export const AUTH_DEFAULT = {
    authUser: {},
    onSignInOutClicked: () => {}
}
export const authContext = React.createContext<IAuthContext>(AUTH_DEFAULT as IAuthContext)


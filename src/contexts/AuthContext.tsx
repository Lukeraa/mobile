import { createContext, ReactNode, useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { api } from "../services/api";

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
    name: string;
    avatarUrl: string;
}

export interface AuthContentDataProps {
    user: UserProps;
    isUserLoading: boolean;
    signIn: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
} 

export const AuthContext = createContext({} as AuthContentDataProps);

export function AuthContextProvider( {children}: AuthProviderProps){

    const [ user, setUser] = useState<UserProps>({} as UserProps);
    const [isUserLoading, setIsUserLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.CLIENT_ID,
        //clientId: '1008245014293-pm0eofjdo4u42st7c61ia0clkmmfb267.apps.googleusercontent.com',
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        scopes: [ 'profile', 'email' ]
    });

    async function signIn (){
        try {
            setIsUserLoading(true)
            await promptAsync()
        } catch (err) {
            console.log(err)
            throw err;
        } finally {
            setIsUserLoading(false)
        }
    }

    async function signInWithGoogle (access_token: string){
        try {
            setIsUserLoading(true)

            const tokenResponse = await api.post('/users', { access_token })
            api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`

            const userInfoResponse = await api.get('/me')
            setUser(userInfoResponse.data.user)

        } catch (err) {
            console.log(err)
            throw err
        } finally {
            setIsUserLoading(false)
        }
    }

    useEffect(() => {
        if (response?.type == 'success' && response.authentication?.accessToken){
            signInWithGoogle(response.authentication.accessToken);
        }
    }, [response]);
    
    return (
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user,
        }}>
        
            {children}
            
        </AuthContext.Provider>        
    )
}

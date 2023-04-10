import { useContext } from 'react';

import { AuthContext, AuthContentDataProps } from '../contexts/AuthContext'

export function useAuth(): AuthContentDataProps {
    const context = useContext(AuthContext);
    
    return context;
}
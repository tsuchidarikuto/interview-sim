'use client';
import {createContext,useEffect,useState,ReactNode} from 'react';
import { useRouter,usePathname } from 'next/navigation';
import {onAuthStateChanged,User} from 'firebase/auth';

import {auth} from '@/firebase';

type Value = {
    user: User | null;
};

const defaultValue: Value = {
    user: null
};

export const AuthContext = createContext<Value>(defaultValue);

export function AuthProvider({children}: {children:ReactNode}){
    const {push} = useRouter();
    const pathname = usePathname();

    const [user,setUser] = useState<User | null>(null);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{        
        const unsubscribe = onAuthStateChanged(auth,user=>{
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    },[]);

    useEffect(()=>{
        if(!loading){
            const isLogin = !!user;
            if(!isLogin && pathname !== '/login' && pathname !== '/signup'){
                push('/login');
            }
        }
    },[user,pathname,loading]);
    
    console.log(user);

    return (
        <AuthContext.Provider value ={{user}}>{children}</AuthContext.Provider>
    )
}

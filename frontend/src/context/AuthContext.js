import React, {useContext, useState, useEffect} from "react"
import axios from "axios";

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const HOST = "http://localhost:4000";


    useEffect(() => {
        if(true){
            getCurrentUser().then(() => {
                setLoading(false)
            }).catch(() => {
                setLoading(false)
            })
        }
    }, [1])

    function signup(user) {
        let data = new FormData();
        data.append('img', user.img, user.img);
        data.append('username', user.username)
        data.append('email', user.email)
        data.append('password', user.password)
        data.append('name', user.name)
        data.append('accountType', user.accountType)
        data.append('branch', user.branch)

        return axios({
            method: "POST",
            data: data,
            withCredentials: true,
            url: `${HOST}/register`,
        })
    }

    function login(username, password) {
        return axios({
            method: "POST",
            data: {
                username: username,
                password: password,
            },
            withCredentials: true,
            url: `${HOST}/login`,
        })
    }

    function getCurrentUser() {
        return new Promise((resolve, reject) => {
            axios({
                method: "get",
                withCredentials: true,
                url: `${HOST}/user`,
            }).then((res) => {
                if (res.data.user) {
                    setCurrentUser(res.data.user)
                    resolve();
                } else {
                    setCurrentUser(null);
                    reject();
                }
            })

        })
    }


    function logout() {
        return new Promise((resolve, reject) => {
            axios({
                method: "post",
                withCredentials: true,
                url: `${HOST}/logout`,
            }).then((res) => {
                setCurrentUser(null)
                resolve()
                console.log(res)
            })
        })
    }

    function resetPassword(email) {

    }


    useEffect(() => {

    }, [])

    const value = {
        currentUser,
        setCurrentUser,
        getCurrentUser,
        login,
        signup,
        logout,
        resetPassword,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
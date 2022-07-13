import React, {createContext, useState} from 'react'


export const GlobalState = createContext()
export const DataProvider = ({children}) =>{
    const [reload, setReload] = useState(Math.random())

    const state = {
        reload: reload,
        setReload: setReload,
    }

    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    )
}
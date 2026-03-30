import React, {createContext, useContext} from "react";

const UserContext = createContext({
    user: null,
    setUser: null,
    loading: true
})

export default UserContext;
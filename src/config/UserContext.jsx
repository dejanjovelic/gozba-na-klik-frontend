import React, {createContext, useContext} from "react";

const UserContext = createContext({
    user: null,
    setUser: null
})

export default UserContext;
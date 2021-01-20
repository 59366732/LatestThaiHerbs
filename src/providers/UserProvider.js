import React, { Component, createContext } from "react";
import { auth, generateUserDocument } from "../database/firebase";


export const UserContext = createContext({ user: null });

class UserProvider extends Component {
  state = {
    user: null
  };

  
  
  componentDidMount = async () => {
    auth.onAuthStateChanged(async userAuth => {
      const user = await generateUserDocument(userAuth);
      this.setState({ user });
    });


  };

  render() {
    const { user } = this.state;

    return (
      <UserContext.Provider value={user}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserProvider;

// import React, { createContext, useContext, useReducer } from 'react';

// export const StateContext = createContext();

// export const StateProvider = ({ reducer, initialState, children }) => (
//     <StateContext.Provider value= { useReducer(reducer, initialState) }>
//         {children}
//     </StateContext.Provider>
// );

// export const useStateValue = () => useContext(StateContext);
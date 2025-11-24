import React, { createContext, useReducer } from "react";

export const OrderContext = createContext();

const initialState = {
  customerId: null,
  restaurantId: null,
  deliveryAddressId: null,
  items: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CUSTOMER":
      return { ...state, customerId: action.payload };

    case "SET_RESTAURANT":
      return { ...state, restaurantId: action.payload };

    case "SET_ADDRESS":
      return { ...state, deliveryAddressId: action.payload };

    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case "REMOVE_ITEM": 
      return {
        ...state,
        items: state.items.filter(x => x.id !== action.payload),
      };

    case "CLEAR_ORDER":
      return {...state, items: []};

    default:
      return state;
  }
}

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
}


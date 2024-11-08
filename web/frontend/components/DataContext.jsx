import React, { createContext, useState } from "react";
export const Context = createContext();
export const ContextProvider = ({ children }) => {
  const [data, setData] = useState("");
  const [siteUrls , setSiteUrls] = useState("")
  return (
    <Context.Provider value={{ data, setData  , siteUrls , setSiteUrls}}>{children}</Context.Provider>
  );
};

import { createContext, useState, useContext } from "react";

const ErrorContext = createContext(null);

const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};
const useError = () => {
  const context = useContext(ErrorContext);
  return context;
};

export { ErrorProvider, useError };

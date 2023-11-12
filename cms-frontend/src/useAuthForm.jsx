import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useAuthForm = (endpoint, setUser) => {
  const [errors, setErrors] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;

    if (!username || !password) {
      setErrors(["Fields can not be blank!"]);
      return;
    }

    const options = {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    };

    try {
      const response = await fetch(endpoint, options);

      if (!response.ok) {
        const errs = await response.json();
        console.log(errs);
        setErrors(errs.message);
        return;
      }

      const result = await response.json();
      setUser(result.data);
      navigate("/dashboard");
    } catch (error) {
      setErrors(["Unknown error has occurred."]);
    }
  };

  return {
    handleSubmit,
    errors,
    setErrors,
  };
};

export default useAuthForm;

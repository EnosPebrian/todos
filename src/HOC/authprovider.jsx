import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { constant } from "../redux/constant";
import SpinnerLoading from "../components/SpinnerLoading";
import api from "../json-server/api";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const userSelector = useSelector((state) => state.auth);

  const fetchAuth = () => {
    const userid = JSON.parse(localStorage.getItem("todos-auth"));
    if (!userid) return setIsLoading(false);
    api
      .get(`users/${userid}`)
      .then((res) => {
        dispatch({ type: constant.login, payload: res.data });
      })
      .catch((err) => {
        localStorage.removeItem("todos-auth");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAuth();
    setTimeout(() => setIsLoading(false), 3000);
  }, []);

  useEffect(() => {
    if (useSelector.id) setIsLoading(false);
  }, [useSelector]);

  return isLoading ? <SpinnerLoading /> : children;
}

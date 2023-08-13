import api from "../../json-server/api";
import { constant } from "../constant";

export const userLogin = (values) => {
  return async (dispatch) => {
    try {
      const res = await api.get(`/users`, { params: { ...values } });
      if (!res.data.length) throw new Error("Wrong Username or Password");
      await dispatch({ type: constant.login, payload: res.data[0] });
      localStorage.setItem("todos-auth", res.data[0].id);
      return constant.success;
    } catch (err) {
      localStorage.removeItem("todos-auth");
      return err.message;
    }
  };
};

export const userLogout = () => {
  return async (dispatch) => {
    try {
      await dispatch({ type: constant.logout });
      localStorage.removeItem("todos-auth");
      return constant.success;
    } catch (err) {
      console.log(err);
      return err.message;
    }
  };
};

import { act } from "react-dom/test-utils";
import { constant } from "../constant";

const init_state = {
  id: 0,
  fullname: "",
  email: "",
  password: "",
};

export const userReducer = (state = init_state, action) => {
  if (action.type === constant.login)
    return {
      ...state,
      ...action.payload,
    };
  if (action.type === constant.logout) return init_state;
  if (action.type === constant.updateProfile)
    return {
      ...state,
      ...action.payload,
    };

  return state;
};

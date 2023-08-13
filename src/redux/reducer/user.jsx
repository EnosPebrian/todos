import { constant } from "../constant";

const init_state = {
  fullname: "",
  email: "",
  password: "",
};

export const userReducer = (state = init_state, action) => {
  if (action.type === constant.login)
    return {
      ...state,
      fullname: action.payload.fullname,
      email: action.payload.email,
      password: action.payload.password,
    };
  if (action.type === constant.logout) return init_state;
  if (action.type === constant.updateProfile)
    return {
      ...state,
      fullname: action.payload.fullname,
      email: action.payload.email,
      password: action.payload.password,
    };

  return state;
};

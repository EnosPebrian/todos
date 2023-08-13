import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../json-server/api";
import { useEffect } from "react";

export default function Redirect() {
  const navigate = useNavigate();
  const userSelector = useSelector((state) => state.auth);
  useEffect(() => {
    if (userSelector?.id)
      return navigate(
        `/dashboard/${userSelector.fullname.split(" ").join("")}`
      );
  }, [userSelector]);

  useEffect(() => {
    if (userSelector?.id)
      return navigate(
        `/dashboard/${userSelector.fullname.split(" ").join("")}`
      );
  }, []);
}

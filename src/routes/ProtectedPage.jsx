import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedPage({
  children,
  needLogin = false,
  guestOnly = false,
}) {
  const navigate = useNavigate();
  const userid = JSON.parse(localStorage.getItem("todos-auth"));
  useEffect(() => {
    if (needLogin && !userid) navigate(`/login`);
    else if (guestOnly && userid) navigate(`/dashboard`);
  }, [children]);

  return children;
}

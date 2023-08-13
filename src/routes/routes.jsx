import Redirect from "../components/redirectdashboard";
import Dashboard from "../pages/Dashboard";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import ProtectedPage from "./ProtectedPage";

class Routeclass {
  constructor(path, element) {
    this.path = path;
    this.element = element;
  }
}

export const routes = [
  new Routeclass(
    "/login",
    (
      <ProtectedPage guestOnly={true}>
        <Login />
      </ProtectedPage>
    )
  ),
  new Routeclass(
    "/register",
    (
      <ProtectedPage>
        <Register />
      </ProtectedPage>
    )
  ),
  new Routeclass(
    "/dashboard/:username",
    (
      <ProtectedPage needLogin={true}>
        <Dashboard />
      </ProtectedPage>
    )
  ),
  new Routeclass(
    "/dashboard",
    (
      <ProtectedPage needLogin={true}>
        <Redirect />
      </ProtectedPage>
    )
  ),
];

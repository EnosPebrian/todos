import { Route, Routes } from "react-router-dom";
import "./App.css";
import { routes } from "./routes/routes";

function App() {
  return (
    <>
      <Routes>
        {routes.map((route, idx) => (
          <Route {...route} key={idx} />
        ))}
      </Routes>
    </>
  );
}

export default App;

import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";

function App(): React.ReactElement {
  return (
    <>
      <NavBar />;
      <Outlet />
    </>
  );
}
export default App;

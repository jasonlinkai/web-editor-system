import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { MobxStateTreeStoreProvider } from "source/libs/mobx/MobxStateTreeProvider";
import Home from "source/pages/Home";
import Login from "source/pages/Login";
import WebEditor from "source/pages/WebEditor";
import Privacy from "./pages/Privacy";
import Services from "./pages/Services";
import Redirect from "./pages/Redirect";
import { useStores } from "./libs/mobx/useMobxStateTreeStores";

function RequireAuth({ children }: { children: JSX.Element }) {
  let { isAuthenticated } = useStores();
  let location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export const routes = [
  {
    path: "/login",
    element: Login,
    isProtected: false,
  },
  {
    path: "/",
    element: Home,
    isProtected: true,
  },
  {
    path: "/web-editor",
    element: WebEditor,
    isProtected: true,
  },
  {
    path: "/redirect",
    element: Redirect,
    isProtected: false,
  },
  {
    path: "/privacy",
    element: Privacy,
    isProtected: false,
  },
  {
    path: "/services",
    element: Services,
    isProtected: false,
  },
];

function App() {
  console.log("App rerendered!");
  useEffect(() => {
    window.addEventListener("error", (e) => {
      console.log("註冊在最外層的全局錯誤監聽: ", e.message);
    });
  });
  return (
    <MobxStateTreeStoreProvider>
      <div className="App">
        <header className="App-header"></header>
        <BrowserRouter>
          <Routes>
            {routes.map(({ isProtected, path, element }) => {
              const Component = element;
              return (
                <Route
                  key={path}
                  path={path}
                  element={
                    isProtected ? (
                      <RequireAuth>
                        <Component />
                      </RequireAuth>
                    ) : (
                      <Component />
                    )
                  }
                />
              );
            })}
          </Routes>
        </BrowserRouter>
      </div>
    </MobxStateTreeStoreProvider>
  );
}

export default App;

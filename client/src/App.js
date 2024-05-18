import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MobxStateTreeStoreProvider } from "@/libs/mobx/MobxStateTreeProvider";
import Home from "@/pages/Home";
import WebEditor from "@/pages/WebEditor";

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/web-editor",
    element: <WebEditor />,
  },
];

const router = createBrowserRouter(routes);

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
        <RouterProvider router={router} />
      </div>
    </MobxStateTreeStoreProvider>
  );
}

export default App;

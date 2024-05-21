import { useStores } from "@/libs/mobx/useMobxStateTreeStores";
import { observer } from "mobx-react-lite";
import { Navigate, useSearchParams } from "react-router-dom";

const Redirect = observer(() => {
  const { setToken } = useStores();
  const [searchParams] = useSearchParams();
  const credential = searchParams.get("credential");
  if (credential) {
    setToken(searchParams.get("credential") || "");
    return <Navigate to="/" />
  } else {
    return <Navigate to="/login" />
  }
});

export default Redirect;

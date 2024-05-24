import styles from "./Login.module.scss";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";

const Login = observer(() => {
  return (
    <div className={styles.login}>
      <h1 className={styles.loginTitle}>web-editor.js</h1>
      <div className={styles.previousWork}>
        <h2 className={styles.previousWorkTitle}>Please login first</h2>
      </div>
      <a href={`${process.env.REACT_APP_API_URL}/auth/google`}>
        <Button>Google Login</Button>
      </a>
    </div>
  );
});

export default Login;

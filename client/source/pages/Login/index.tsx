"use client"
import styles from "./Login.module.scss";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";
import { useEffect } from "react";

const Login = observer(() => {
  const { testServer } = useStores();
  useEffect(() => {
    testServer();
  }, [testServer]);
  return (
    <div className={styles.login}>
      <h1 className={styles.loginTitle}>web-editor.js</h1>
      <div className={styles.previousWork}>
        <h2 className={styles.previousWorkTitle}>Please login first</h2>
      </div>
      <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
        <Button>Google Login</Button>
      </a>
    </div>
  );
});

export default Login;

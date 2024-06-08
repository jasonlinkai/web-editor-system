"use client";
import "../../styles/mui.scss";
import "../../styles/editor.css";
import { MobxStateTreeStoreProvider } from "source/libs/mobx/MobxStateTreeProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MobxStateTreeStoreProvider>{children}</MobxStateTreeStoreProvider>;
}

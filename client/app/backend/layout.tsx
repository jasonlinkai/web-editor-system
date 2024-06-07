"use client";
import "../../styles/mui.scss";
import { MobxStateTreeStoreProvider } from "source/libs/mobx/MobxStateTreeProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MobxStateTreeStoreProvider>{children}</MobxStateTreeStoreProvider>;
}

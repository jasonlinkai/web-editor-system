"use client";
import { MobxStateTreeStoreProvider } from "source/libs/mobx/MobxStateTreeProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MobxStateTreeStoreProvider>{children}</MobxStateTreeStoreProvider>;
}

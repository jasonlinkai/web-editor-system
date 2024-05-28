import { types as t, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";

export const UserModel = t.model("UserModel", {
  id: t.maybeNull(t.number),
  uuid: t.optional(t.string, ""),
  username: t.optional(t.string, ""),
  avatarUrl: t.optional(t.string, ""),
  email: t.optional(t.string, ""),
  googleId: t.optional(t.string, ""),
});

export type UserModelType = Instance<typeof UserModel>;
export type UserModelSnapshotInType = SnapshotIn<typeof UserModel>;
export type UserModelSnapshotOutType = SnapshotOut<typeof UserModel>;

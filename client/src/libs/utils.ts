import { v4 as uuid } from "uuid";
import {
  AstNodeModelSnapshotInType,
  AstNodeModelSnapshotOutType,
} from "./mobx/AstNodeModel";

export const getRandomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const makeOptions = (values: string[]) => {
  return values.map((v) => {
    return { label: v, value: v };
  });
};

export const recursiveClearUuid = (
  ast: AstNodeModelSnapshotInType | AstNodeModelSnapshotOutType,
  parentUuid?: string
) => {
  ast.uuid = uuid();
  ast.parent = parentUuid;
  if (ast.children) {
    (ast.children as any[]).forEach((child) => {
      recursiveClearUuid(child, ast.uuid);
    });
  }
  return ast;
};

import { v4 as uuid } from "uuid";
import {
  AstNodeModelSnapshotInType,
} from "./mobx/AstNodeModel";

export const getRandomColor = () => {
  const r = Math.round(255 * Math.random());
  const g = Math.round(255 * Math.random());
  const b = Math.round(255 * Math.random());
  const a = 1 * Math.random();
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const makeOptions = (values: string[]) => {
  return values.map((v) => {
    return { label: v, value: v };
  });
};

export const recursiveClearUuid = (
  ast: AstNodeModelSnapshotInType,
  parentUuid?: string
): AstNodeModelSnapshotInType => {
  ast.uuid = uuid();
  ast.parent = parentUuid;
  if (ast.children) {
    (ast.children as any[]).forEach((child) => {
      recursiveClearUuid(child, ast.uuid);
    });
  }
  return ast;
};

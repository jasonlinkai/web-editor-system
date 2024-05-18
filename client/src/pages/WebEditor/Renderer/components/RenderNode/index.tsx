import styles from "./RenderNode.module.scss";
import clsx from "clsx";
import React, { SyntheticEvent } from "react";
import { observer } from "mobx-react-lite";
import { AstNodeModelType } from "@/libs/mobx/AstNodeModel";

interface RenderNodeProps {
  ast: AstNodeModelType | undefined;
  isEditMode?: boolean;
  handleOnClick?: (ev: React.MouseEvent, node: AstNodeModelType) => void;
  handleOnDragStart?: (ev: React.DragEvent, node: AstNodeModelType) => void;
  handleOnDragOver?: (ev: React.DragEvent, node: AstNodeModelType) => void;
  handleOnDragLeave?: (ev: React.DragEvent, node: AstNodeModelType) => void;
  handleOnDrop?: (ev: React.DragEvent, node: AstNodeModelType) => void;
}

const RenderNode: React.FC<RenderNodeProps> = observer(
  ({ ast, isEditMode = false, ...p }) => {
    const {
      handleOnClick,
      handleOnDragStart,
      handleOnDragOver,
      handleOnDragLeave,
      handleOnDrop,
    } = p;
    if (!ast) return null;

    const isSelected = isEditMode && ast.isSelected;
    const draggable = isEditMode && ast.isSelected && !ast.isRootNode;
    const dropable = isEditMode && ast.isContainerNode;

    const node: AstNodeModelType = ast;
    const { type, props, children } = node;

    // register event for web-editor
    const editorEventListeners: {
      [key: string]: React.EventHandler<SyntheticEvent> | undefined;
    } = {};
    editorEventListeners.onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleOnClick && handleOnClick(e, node);
      node.setIsSelected(true);
    };
    if (draggable) {
      editorEventListeners.onDragStart = (e: React.DragEvent) => {
        handleOnDragStart && handleOnDragStart(e, node);
      };
    }
    if (dropable) {
      editorEventListeners.onDragOver = (e: React.DragEvent) => {
        handleOnDragOver && handleOnDragOver(e, node);
        node.setIsDragOvered(true);
      };
      editorEventListeners.onDragLeave = (e: React.DragEvent) => {
        handleOnDragLeave && handleOnDragLeave(e, node);
        node.setIsDragOvered(false);
      };

      editorEventListeners.onDrop = (e: React.DragEvent) => {
        handleOnDrop && handleOnDrop(e, node);
        node.setIsDragOvered(false);
      };
    }

    let renderChildren;
    if (node.isContainerNode) {
      renderChildren = Array.isArray(children) ? children : [children];
      renderChildren = renderChildren.map((child) => {
        return (
          <RenderNode
            key={child.uuid}
            ast={child}
            isEditMode={isEditMode}
            {...p}
          />
        );
      });
    } else if (node.isTextNode) {
      renderChildren = node.content;
    } else if (node.isSelfClosingNode) {
      renderChildren = undefined;
    }
    return React.createElement(
      type,
      {
        ...props,
        ...editorEventListeners,
        ...{ ...props.attributes, datanodetype: type }, // datanodetpye是為了選中時::psesudo element content可以拿到節點類型
        style: {
          ...props.style,
        },
        className: clsx([
          props.className,
          {
            [styles.node]: true,
            [styles.selectedNode]: isSelected,
            [styles.dragOverNode]: !isSelected && node.isDragOvered,
          },
        ]),
        draggable,
      },
      renderChildren
    );
  }
);

export default RenderNode;

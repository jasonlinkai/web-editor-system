import styles from "./RenderNode.module.scss";
import clsx from "clsx";
import React, { SyntheticEvent, useLayoutEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { AstNodeModelType } from "source/libs/mobx/AstNodeModel";

interface RenderNodeProps {
  ast: AstNodeModelType | undefined;
  isEditMode?: boolean;
  handleOnClick?: (ev: React.MouseEvent, node: AstNodeModelType) => void;
  handleOnDragStart?: (ev: React.DragEvent, node: AstNodeModelType) => void;
  handleOnDragOver?: (ev: React.DragEvent, node: AstNodeModelType) => void;
  handleOnDragLeave?: (ev: React.DragEvent, node: AstNodeModelType) => void;
  handleOnDrop?: (ev: React.DragEvent, node: AstNodeModelType) => void;
}

const getPaddingNumber = (p: string) => {
  return Number(p.replace("px", "")) || 0;
};

const devicePixelRatio = window.devicePixelRatio || 1;

const genNewCanvasForPaddingAndMargin = (id: string, dom: HTMLElement) => {
  const canvas = document.createElement("canvas");
  const rect = dom.getBoundingClientRect();
  const paddingTop = getPaddingNumber(dom.style.paddingTop);
  const paddingBottom = getPaddingNumber(dom.style.paddingBottom);
  const paddingRight = getPaddingNumber(dom.style.paddingRight);
  const paddingLeft = getPaddingNumber(dom.style.paddingLeft);
  const marginTop = getPaddingNumber(dom.style.marginTop);
  const marginBottom = getPaddingNumber(dom.style.marginBottom);
  const marginRight = getPaddingNumber(dom.style.marginRight);
  const marginLeft = getPaddingNumber(dom.style.marginLeft);
  const width = rect.width + marginLeft + marginRight;
  const height = rect.height + marginTop + marginBottom;
  canvas.id = id;
  canvas.style.position = "fixed";
  canvas.style.top = `${rect.top - marginTop}px`;
  canvas.style.bottom = `${rect.bottom}px`;
  canvas.style.left = `${rect.left - marginLeft}px`;
  canvas.style.right = `${rect.right}px`;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.style.pointerEvents = "none";
  canvas.style.overscrollBehavior = "none";
  const ctx = canvas.getContext("2d");
  canvas.width = (width) * devicePixelRatio;
  canvas.height = (height) * devicePixelRatio;
  if (ctx) {
    // clear all older content
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //
    // create margin area
    //
    ctx.fillStyle = "rgb(166, 68, 68, 0.3)";
    ctx.fillRect(0, 0, width, marginTop);
    ctx.fillRect(0, height - marginBottom, width, marginBottom);
    ctx.fillRect(0, marginTop, marginLeft, height - (marginTop + marginBottom));
    ctx.fillRect(width - marginRight, marginTop, marginRight, height - (marginTop + marginBottom));
    //
    // create padding area
    //
    ctx.fillStyle = "rgb(68, 166, 68, 0.3)";
    ctx.fillRect(
      marginLeft,
      marginTop,
      width - (marginLeft + marginRight),
      height - (marginTop + marginBottom)
    );
    ctx.clearRect(
      marginLeft + paddingLeft,
      marginTop + paddingTop,
      width - (marginLeft + marginRight) - (paddingLeft + paddingRight),
      height - (marginTop + marginBottom) - (paddingTop + paddingBottom)
    );
  }
  return canvas;
};
const findByIdAndRemoveSelf = (id: string) => {
  const dom = document.getElementById(id);
  dom?.parentNode?.removeChild(dom);
};

const RenderNode: React.FC<RenderNodeProps> = observer(
  ({ ast, isEditMode = false, ...p }) => {
    const domRef = useRef<HTMLElement>(null);
    const selectedDomRef: React.MutableRefObject<HTMLCanvasElement | null> =
      useRef(null);
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
    if (isEditMode) {
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
        };
      }
      editorEventListeners.onMouseOver = (e: React.DragEvent) => {
        e.stopPropagation();
        node.setIsDragOvered(true);
      };
      editorEventListeners.onMouseOut = (e: React.DragEvent) => {
        e.stopPropagation();
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

    useLayoutEffect(() => {
      if (domRef.current) {
        if (node.isSelected || node.isDragOvered) {
          if (selectedDomRef.current) {
            findByIdAndRemoveSelf(selectedDomRef.current.id);
          }
          const newCanvas = genNewCanvasForPaddingAndMargin(
            node.uuid,
            domRef.current
          );
          selectedDomRef.current = newCanvas;
          document.body.appendChild(newCanvas);
        } else {
          if (selectedDomRef.current) {
            findByIdAndRemoveSelf(selectedDomRef.current.id);
            selectedDomRef.current = null;
          }
        }
      }
      return () => {
        if (selectedDomRef.current) {
          findByIdAndRemoveSelf(selectedDomRef.current.id);
          selectedDomRef.current = null;
        }
      };
    }, [node.uuid, node.isSelected, node.isDragOvered, node.changeValueTimeStamp]);

    return React.createElement(
      type,
      {
        ref: domRef,
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

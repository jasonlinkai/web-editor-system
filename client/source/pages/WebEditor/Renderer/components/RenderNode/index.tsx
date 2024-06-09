import styles from "./RenderNode.module.scss";
import clsx from "clsx";
import React, {
  SyntheticEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { observer } from "mobx-react-lite";
import { AstNodeModelType } from "source/libs/mobx/AstNodeModel";
import { useStores } from "@/libs/mobx/useMobxStateTreeStores";

interface RenderNodeProps {
  ast: AstNodeModelType | undefined;
  isEditMode?: boolean;
  isParentDropable?: boolean;
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

const SelectedAndHoveredEffect = observer(
  ({
    uuid,
    type,
    isSelected = false,
    isDragOvered = false,
    updated,
  }: {
    uuid: string;
    type: string;
    isSelected: boolean;
    isDragOvered: boolean;
    updated: number | null;
  }) => {
    const { selectedPage } = useStores();
    const [updatedTime, setUpdatedTime] = useState(0);

    const onScroll = useCallback((e: any) => {
      setUpdatedTime(Date.now());
    }, []);

    useLayoutEffect(() => {
      const color = isSelected
        ? "rgb(250, 68, 68)"
        : isDragOvered
        ? "#1976d2"
        : "tranparent";
      const doc = (document.getElementById("editorArea") as HTMLIFrameElement)
        ?.contentWindow?.document;
      if (!doc) return;
      const dom = doc.getElementById(uuid);
      if (!dom) return;
      const rect = (dom as HTMLElement).getBoundingClientRect();
      const effect = doc.getElementById(`effect-${uuid}`) as HTMLDivElement;
      effect.style.position = "fixed";
      effect.style.zIndex = "1";
      effect.style.top = `${rect.top}px`;
      effect.style.left = `${rect.left}px`;
      effect.style.width = `${rect.width}px`;
      effect.style.height = `${rect.height}px`;
      effect.style.backgroundColor = "transparent";
      effect.style.pointerEvents = "none";
      effect.style.border = `2px solid ${color}`;
      const tag = doc.getElementById(`tag-${uuid}`) as HTMLDivElement;
      tag.style.width = "fit-content";
      tag.style.backgroundColor = color;
      tag.style.color = "white";
      tag.style.fontSize = "0.8rem";
      tag.style.paddingLeft = "5px";
      tag.style.paddingRight = "5px";
      tag.style.borderBottomRightRadius = "5px";
      const canvas = doc.getElementById(`canvas-${uuid}`) as HTMLCanvasElement;
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
      canvas.style.position = "fixed";
      canvas.style.zIndex = "-1";
      canvas.style.top = `${rect.top - marginTop}px`;
      canvas.style.bottom = `${rect.bottom}px`;
      canvas.style.left = `${rect.left - marginLeft}px`;
      canvas.style.right = `${rect.right}px`;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.style.pointerEvents = "none";
      canvas.style.overscrollBehavior = "none";
      const ctx = canvas.getContext("2d");
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      if (ctx) {
        // clear all older content
        ctx.scale(devicePixelRatio, devicePixelRatio);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //
        // create margin area
        //
        ctx.fillStyle = "rgb(206, 168, 68, 0.5)";
        ctx.fillRect(0, 0, width, marginTop);
        ctx.fillRect(0, height - marginBottom, width, marginBottom);
        ctx.fillRect(
          0,
          marginTop,
          marginLeft,
          height - (marginTop + marginBottom)
        );
        ctx.fillRect(
          width - marginRight,
          marginTop,
          marginRight,
          height - (marginTop + marginBottom)
        );
        //
        // create padding area
        //
        ctx.fillStyle = "rgb(68, 206, 68, 0.5)";
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
    }, [
      isSelected,
      isDragOvered,
      selectedPage?.editor.editorLayout.width,
      updated,
      updatedTime,
      uuid,
    ]);

    useLayoutEffect(() => {
      const w = (document.getElementById("editorArea") as HTMLIFrameElement)
        ?.contentWindow;
      if (!w) return;
      w.addEventListener("scroll", onScroll);
      return () => {
        w.removeEventListener("scroll", onScroll);
      };
    }, [onScroll]);

    return (
      <div id={`effect-${uuid}`}>
        <canvas id={`canvas-${uuid}`}></canvas>
        <div id={`tag-${uuid}`}>{type}</div>
      </div>
    );
  }
);

const RenderNode: React.FC<RenderNodeProps> = observer(
  ({ ast, isEditMode = false, isParentDropable = true, ...p }) => {
    const domRef = useRef<HTMLElement>(null);
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
    const dropable =
      isEditMode &&
      isParentDropable &&
      (!ast.isSelected || ast.isRootNode) &&
      ast.isContainerNode;

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
            isParentDropable={dropable}
            {...p}
          />
        );
      });
    } else if (node.isTextNode) {
      renderChildren = node.content;
    } else if (node.isSelfClosingNode) {
      renderChildren = undefined;
    }

    return (
      <>
        {React.createElement(
          type,
          {
            id: node.uuid,
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
        )}
        {(node.isSelected || node.isDragOvered) && domRef.current && (
          <SelectedAndHoveredEffect
            uuid={node.uuid}
            type={type}
            isSelected={node.isSelected}
            isDragOvered={node.isDragOvered}
            updated={node.changeValueTimeStamp}
          />
        )}
      </>
    );
  }
);

export default RenderNode;

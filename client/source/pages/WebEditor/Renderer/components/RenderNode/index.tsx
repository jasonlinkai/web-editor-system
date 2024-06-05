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

const genNewWrapperForElement = (
  id: string,
  dom: HTMLElement,
  isSelected: boolean,
  isDragOvered: boolean
) => {
  const wrapper = document.createElement("div");
  const rect = dom.getBoundingClientRect();
  const color = isSelected
    ? "rgb(250, 68, 68)"
    : isDragOvered
    ? "#1976d2"
    : "tranparent";
  wrapper.id = id;
  wrapper.style.position = "fixed";
  wrapper.style.zIndex = "2";
  wrapper.style.top = `${rect.top}px`;
  wrapper.style.bottom = `${rect.bottom}px`;
  wrapper.style.left = `${rect.left}px`;
  wrapper.style.right = `${rect.right}px`;
  wrapper.style.width = `${rect.width}px`;
  wrapper.style.height = `${rect.height}px`;
  wrapper.style.border = `2px solid ${color}`;
  wrapper.style.pointerEvents = "none";
  wrapper.style.overscrollBehavior = "none";
  const tagName = dom.attributes.getNamedItem("datanodetype")?.value;
  if (tagName !== undefined) {
    const tag = document.createElement("div");
    tag.innerText = tagName;
    tag.style.width = "fit-content";
    tag.style.backgroundColor = color;
    tag.style.color = "white";
    tag.style.fontSize = "0.8rem";
    tag.style.paddingLeft = "5px";
    tag.style.paddingRight = "5px";
    tag.style.borderBottomRightRadius = "5px";
    wrapper.appendChild(tag);
  }
  return wrapper;
};
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
    ctx.fillRect(0, marginTop, marginLeft, height - (marginTop + marginBottom));
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
  return canvas;
};
const findByIdAndRemoveSelf = (id: string) => {
  const dom = document.getElementById(id);
  dom?.parentNode?.removeChild(dom);
};

const RenderNode: React.FC<RenderNodeProps> = observer(
  ({ ast, isEditMode = false, isParentDropable = true, ...p }) => {
    const prevResizerWidth = useRef<number>(0);
    const resizerOb = useRef<ResizeObserver | undefined>(undefined);
    const resizerPreventRenderTimeoutRef = useRef<
    NodeJS.Timeout | number | undefined
  >(undefined);
    const scrollPreventRenderTimeoutRef = useRef<
      NodeJS.Timeout | number | undefined
    >(undefined);
    const [isScrolling, setIsScrolling] = useState(false);
    const domRef = useRef<HTMLElement>(null);
    const wrapperRef: React.MutableRefObject<HTMLElement | null> = useRef(null);
    const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> =
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
    const dropable =
      isEditMode && isParentDropable && !isSelected && ast.isContainerNode;

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

    useLayoutEffect(() => {
      const resizer = document.getElementById("resizer");
      if (resizer) {
        if (!resizerOb.current) {
          resizerOb.current = new ResizeObserver(([change]) => {
            const newWidth = Math.round(change.contentRect.width);
            console.log('newWidth', newWidth);
            if (newWidth !== prevResizerWidth.current) {
              prevResizerWidth.current = newWidth;
              clearTimeout(resizerPreventRenderTimeoutRef.current);
              setIsScrolling(true);
              resizerPreventRenderTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
              }, 300);
            }
          });
        }
        if (prevResizerWidth.current === 0) {
          const { width } = resizer.getBoundingClientRect();
          prevResizerWidth.current = Math.round(width);
        }
        if (node.isSelected || node.isDragOvered) {
          resizerOb.current.observe(resizer);
        } else {
          resizerOb?.current?.unobserve(resizer);
        }
        return () => {
          resizerOb?.current?.unobserve(resizer);
        };
      }
    }, [node.isSelected, node.isDragOvered]);

    const onScroll = useCallback((e: any) => {
      clearTimeout(scrollPreventRenderTimeoutRef.current);
      setIsScrolling(true);
      scrollPreventRenderTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    }, []);

    useLayoutEffect(() => {
      const renderer = document.getElementById("renderer");
      if (renderer) {
        if (node.isSelected || node.isDragOvered) {
          renderer?.addEventListener("scroll", onScroll);
        } else {
          renderer?.removeEventListener("scroll", onScroll);
        }
        return () => {
          renderer?.removeEventListener("scroll", onScroll);
        };
      }
    }, [onScroll, node.isSelected, node.isDragOvered]);

    useLayoutEffect(() => {
      const clear = () => {
        if (canvasRef.current) {
          findByIdAndRemoveSelf(canvasRef.current.id);
          canvasRef.current = null;
        }
        if (wrapperRef.current) {
          findByIdAndRemoveSelf(wrapperRef.current.id);
          wrapperRef.current = null;
        }
      };
      if (domRef.current) {
        if (!isScrolling && (node.isSelected || node.isDragOvered)) {
          const newWrapper = genNewWrapperForElement(
            node.uuid,
            domRef.current,
            node.isSelected,
            node.isDragOvered
          );
          const newCanvas = genNewCanvasForPaddingAndMargin(
            node.uuid,
            domRef.current
          );
          wrapperRef.current = newWrapper;
          canvasRef.current = newCanvas;
          const renderer = document.getElementById("renderer");
          if (renderer) {
            renderer.appendChild(newWrapper);
            renderer.appendChild(newCanvas);
          }
        } else {
          clear();
        }
      }
      return clear;
    }, [
      node.uuid,
      node.isSelected,
      node.isDragOvered,
      node.changeValueTimeStamp,
      isScrolling,
    ]);

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

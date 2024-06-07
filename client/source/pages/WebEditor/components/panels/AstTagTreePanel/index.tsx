"use client";
import panelStyles from "../Panel.module.scss";
import styles from "./AstTagTreePanel.module.scss";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import { AstNodeModelType } from "source/libs/mobx/AstNodeModel";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";
import { useEffect } from "react";
import { FaImage, FaVideo } from "react-icons/fa";
import { LuContainer } from "react-icons/lu";
import { GoTypography } from "react-icons/go";
import { MdSmartButton } from "react-icons/md";
import Icons from "@/editor-components/Icons";

const getIcon = (type: AstNodeModelType["type"]) => {
  if (type === "div") {
    return LuContainer;
  }
  if (type === "span") {
    return GoTypography;
  }
  if (type === "h1") {
    return GoTypography;
  }
  if (type === "h2") {
    return GoTypography;
  }
  if (type === "h3") {
    return GoTypography;
  }
  if (type === "h4") {
    return GoTypography;
  }
  if (type === "h5") {
    return GoTypography;
  }
  if (type === "button") {
    return MdSmartButton;
  }
  if (type === "img") {
    return FaImage;
  }
  if (type === "video") {
    return FaVideo;
  }
  if (type === "carousel") {
    return Icons.MdOutlineViewCarousel;
  }
  return null;
};

const AstTagTree = observer(
  ({ node }: { node: AstNodeModelType; level?: number }) => {
    const { selectedPage } = useStores();
    if (!selectedPage) return null;
    const { editor } = selectedPage;
    const { setSelectedAstNode } = editor;
    const { isContainerNode } = node;
    const Icon = getIcon(node.type);
    return (
      <div
        id={`ast-tree-panel-item-${node.uuid}`}
        key={`ast-tree-panel-item-${node.uuid}`}
        className={styles.astTreePanelItem}
        onClick={(e) => {
          e.stopPropagation();
          node.setIsSelected(true);
          setSelectedAstNode(node);
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
          node.setIsDragOvered(true);
        }}
        onMouseOut={(e) => {
          e.stopPropagation();
          node.setIsDragOvered(false);
        }}
      >
        <div
          className={clsx([
            styles.astTreePanelItemStartTag,
            {
              [styles.astTreePanelItemStartTagSelected]: node.isSelected,
              [styles.astTreePanelItemStartTagHovered]:
                !node.isSelected && node.isDragOvered,
            },
          ])}
        >
          {Icon && <Icon style={{ marginRight: "0.4rem" }} />}
          {node.type}
        </div>

        {isContainerNode && (
          <>
            {node.children.map((child: AstNodeModelType) => {
              return (
                <AstTagTree
                  key={`ast-tree-panel-item-child-${child.uuid}`}
                  node={child}
                />
              );
            })}
          </>
        )}
      </div>
    );
  }
);

const AstTagTreePanel = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { ast, editor } = selectedPage;
  useEffect(() => {
    if (editor.selectedAstNode) {
      const selected = document.getElementById(
        `ast-tree-panel-item-${editor.selectedAstNode.uuid}`
      );
      if (selected) {
        selected.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [editor.selectedAstNode]);
  return (
    <div className={panelStyles.panel}>
      <div className={styles.astTreePanelArea}>
        {ast && <AstTagTree node={ast} />}
      </div>
    </div>
  );
});

export default AstTagTreePanel;

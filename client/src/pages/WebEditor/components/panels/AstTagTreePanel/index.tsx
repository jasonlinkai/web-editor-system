import panelStyles from "../Panel.module.scss";
import styles from "./AstTagTreePanel.module.scss";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import { AstNodeModelType } from "@/libs/mobx/AstNodeModel";
import { useStores } from "@/libs/mobx/useMobxStateTreeStores";
import { useEffect } from "react";

const AstTagTree = observer(
  ({ node, level = 0 }: { node: AstNodeModelType; level?: number }) => {
    const { selectedPage } = useStores();
    if (!selectedPage) return null;
    const { editor } = selectedPage;
    const { selectedAstNode, setSelectedAstNode } = editor;
    const { isContainerNode, isTextNode, isSelfClosingNode } = node;
    const marginLeft = `${10 * level}px`;
    return (
      <div
        id={`ast-tree-panel-item-${node.uuid}`}
        key={`ast-tree-panel-item-${node.uuid}`}
        className={styles.astTreePanelItem}
        style={{ marginLeft }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedAstNode(node);
        }}
      >
        <span
          className={clsx([
            styles.astTreePanelItemStartTag,
            {
              [styles.astTreePanelItemStartTagSelected]:
                selectedAstNode?.uuid === node.uuid,
            },
          ])}
        >{`<${node.type}${isSelfClosingNode ? " /" : ""}>`}</span>

        {isContainerNode && (
          <>
            {node.children.map((child: AstNodeModelType) => {
              return (
                <AstTagTree
                  key={`ast-tree-panel-item-child-${child.uuid}`}
                  node={child}
                  level={level + 1}
                />
              );
            })}
          </>
        )}

        {isTextNode && (
          <span style={{ marginLeft: 10 }}>{node.content}</span>
        )}

        {!isSelfClosingNode && (
          <span
            className={clsx([
              styles.astTreePanelItemEndTag,
              {
                [styles.astTreePanelItemEndTagSelected]:
                  selectedAstNode?.uuid === node.uuid,
              },
            ])}
          >{`</${node.type}>`}</span>
        )}
      </div>
    );
  }
);

export const astTagTreePanelHeight = 150;

const AstTagTreePanel = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { ast, editor } = selectedPage;
  useEffect(() => {
    if (editor.selectedAstNode) {
      const selected = document.getElementById(`ast-tree-panel-item-${editor.selectedAstNode.uuid}`)
      if (selected) {
        selected.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [editor.selectedAstNode]);
  return (
    <div className={panelStyles.panel}>
      <div className={panelStyles.panelTitle}>Tree</div>
      <div
        className={styles.astTreePanelArea}
        style={{
          height: `${astTagTreePanelHeight}px`,
          minHeight: `${astTagTreePanelHeight}px`,
        }}
      >
        {ast && <AstTagTree node={ast} />}
      </div>
    </div>
  );
});

export default AstTagTreePanel;

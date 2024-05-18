import styles from "./Panel.module.scss";
import { observer } from "mobx-react-lite";
import Input from "@/shared-components/Input";
import { useStores } from "@/libs/mobx/useMobxStateTreeStores";
import { StyleEnum } from "@/libs/types";
import { useState } from "react";
import clsx from "clsx";
import ActionButton from "../ActionButton";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const BorderPanel = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { editor } = selectedPage;
  const [isOpen, setIsOpen] = useState(true);
  const node = editor.selectedAstNode;
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>Border</div>
        <ActionButton
          className={styles.panelHeaderToggleButton}
          IconComponent={isOpen ? FaArrowUp : FaArrowDown}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        ></ActionButton>
      </div>
      <div
        className={clsx([
          styles.panelArea,
          {
            [styles.panelAreaClose]: !isOpen,
          },
        ])}
      >
        <div className={styles.panelItem}>
          <div className={styles.panelItemColumnArea}>
            <Input
              label="border-style"
              value={node?.props.style.borderStyle || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderStyle,
                  styleValue: e,
                })
              }
            />
            <Input
              label="border-color"
              value={node?.props.style.borderColor || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderColor,
                  styleValue: e,
                })
              }
            />
          </div>
        </div>
        <div className={styles.panelItem}>
          <label className={styles.panelItemLabel}>BorderWidth</label>
          <div className={styles.panelItemColumnArea}>
            <Input
              label="top"
              value={node?.props.style.borderTopWidth || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderTopWidth,
                  styleValue: e,
                })
              }
            />
            <Input
              label="bottom"
              value={node?.props.style.borderBottomWidth || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderBottomWidth,
                  styleValue: e,
                })
              }
            />
            <Input
              label="left"
              value={node?.props.style.borderLeftWidth || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderLeftWidth,
                  styleValue: e,
                })
              }
            />
            <Input
              label="right"
              value={node?.props.style.borderRightWidth || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderRightWidth,
                  styleValue: e,
                })
              }
            />
          </div>
        </div>
        <div className={styles.panelItem}>
          <label className={styles.panelItemLabel}>BorderRadius</label>
          <div className={styles.panelItemColumnArea}>
            <Input
              label="top-left"
              value={node?.props.style.borderTopLeftRadius || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderTopLeftRadius,
                  styleValue: e,
                })
              }
            />
            <Input
              label="top-right"
              value={node?.props.style.borderTopRightRadius || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderTopRightRadius,
                  styleValue: e,
                })
              }
            />
            <Input
              label="bottom-left"
              value={node?.props.style.borderBottomLeftRadius || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderBottomLeftRadius,
                  styleValue: e,
                })
              }
            />
            <Input
              label="bottom-right"
              value={node?.props.style.borderBottomRightRadius || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.borderBottomRightRadius,
                  styleValue: e,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default BorderPanel;

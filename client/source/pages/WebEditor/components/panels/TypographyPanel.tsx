"use client"
import styles from "./Panel.module.scss";
import { observer } from "mobx-react-lite";
import Input, { TextInput } from "source/editor-components/Input";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";
import { StyleEnum } from "source/libs/types";
import { useState } from "react";
import clsx from "clsx";
import ActionButton from "../ActionButton";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Select from "source/editor-components/Select";
import options from "source/editor-components/Select/options";
import ColorInput from "@/editor-components/ColorInput";

const TypographyPanel = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { editor } = selectedPage;
  const [isOpen, setIsOpen] = useState(true);
  const node = editor.selectedAstNode;
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>Typography</div>
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
            <ColorInput
              label="color"
              value={node?.props.style.color || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.color,
                  styleValue: e,
                })
              }
            />
            <Input
              label="size"
              value={node?.props.style.fontSize || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.fontSize,
                  styleValue: e,
                })
              }
            />
            <Input
              label="weight"
              value={node?.props.style.fontWeight || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.fontWeight,
                  styleValue: e,
                })
              }
            />
            <Select
              label="align"
              value={node?.props.style.textAlign || ""}
              onChange={(e) =>
                node?.updateStyle({
                  styleKey: StyleEnum.textAlign,
                  styleValue: e,
                })
              }
              options={options.textAlign}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default TypographyPanel;

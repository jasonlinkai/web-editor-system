"use client";
import styles from "./Panel.module.scss";
import { observer } from "mobx-react-lite";
import InfoField from "source/editor-components/InfoField";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";
import { useState } from "react";
import clsx from "clsx";
import ActionButton from "../ActionButton";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { TextInput } from "source/editor-components/Input";
import { AttributesEnum, SelfClosingNodeType } from "source/libs/types";
import ImageSelect from "@/editor-components/ImageSelect";

const InfoPanel = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { editor } = selectedPage;
  const [isOpen, setIsOpen] = useState(true);
  const node = editor.selectedAstNode;
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>Info</div>
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
            <InfoField label="uuid" value={node?.uuid || ""} />
            <InfoField label="parent" value={node?.parent?.uuid || ""} />
            {node?.isTextNode && (
              <TextInput
                label="content"
                value={node?.content || ""}
                onChange={(e) => {
                  node?.setContent(e);
                }}
              />
            )}
            {node?.type === SelfClosingNodeType.img && (
              <>
                <TextInput
                  label="alt"
                  value={node?.props.attributes.alt || ""}
                  onChange={(e) => {
                    node?.updateAttributes({
                      key: AttributesEnum.alt,
                      value: e,
                    });
                  }}
                />
                <TextInput
                  label="crossOrigin"
                  value={node?.props.attributes.crossOrigin || ""}
                  onChange={(e) => {
                    node?.updateAttributes({
                      key: AttributesEnum.crossOrigin,
                      value: e,
                    });
                  }}
                />
                <ImageSelect
                  label="src"
                  value={node?.props.attributes.src || ""}
                  onChange={(e) => {
                    node?.updateAttributes({
                      key: AttributesEnum.src,
                      value: e,
                    });
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default InfoPanel;

"use client";
import styles from "./Panel.module.scss";
import { observer } from "mobx-react-lite";
import { TextInput } from "source/shared-components/Input";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";
import { useState } from "react";
import clsx from "clsx";
import ActionButton from "../ActionButton";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { MetaEnum } from "@/libs/types";

const MetaPanel = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>Meta</div>
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
            <TextInput
              label="description"
              value={selectedPage?.meta.description || ""}
              onChange={(e) => {
                selectedPage.setMetaByKeyValue({
                  key: MetaEnum.description,
                  value: e,
                });
              }}
            />
            <TextInput
              label="keywords"
              value={selectedPage?.meta.keywords || ""}
              onChange={(e) => {
                selectedPage.setMetaByKeyValue({
                  key: MetaEnum.keywords,
                  value: e,
                });
              }}
            />
            <TextInput
              label="author"
              value={selectedPage?.meta.author || ""}
              onChange={(e) => {
                selectedPage.setMetaByKeyValue({
                  key: MetaEnum.author,
                  value: e,
                });
              }}
            />
            <TextInput
              label="ogTitle"
              value={selectedPage?.meta.ogTitle || ""}
              onChange={(e) => {
                selectedPage.setMetaByKeyValue({
                  key: MetaEnum.ogTitle,
                  value: e,
                });
              }}
            />
            <TextInput
              label="ogType"
              value={selectedPage?.meta.ogType || ""}
              onChange={(e) => {
                selectedPage.setMetaByKeyValue({
                  key: MetaEnum.ogType,
                  value: e,
                });
              }}
            />
            <TextInput
              label="ogImage"
              value={selectedPage?.meta.ogImage || ""}
              onChange={(e) => {
                selectedPage.setMetaByKeyValue({
                  key: MetaEnum.ogImage,
                  value: e,
                });
              }}
            />
            <TextInput
              label="ogUrl"
              value={selectedPage?.meta.ogUrl || ""}
              onChange={(e) => {
                selectedPage.setMetaByKeyValue({
                  key: MetaEnum.ogUrl,
                  value: e,
                });
              }}
            />
            <TextInput
              label="ogDescription"
              value={selectedPage?.meta.ogDescription || ""}
              onChange={(e) => {
                selectedPage.setMetaByKeyValue({
                  key: MetaEnum.ogDescription,
                  value: e,
                });
              }}
            />
            <TextInput
              label="twitterCard"
              value={selectedPage?.meta.twitterCard || ""}
              onChange={(e) => {
                selectedPage.setMetaByKeyValue({
                  key: MetaEnum.twitterCard,
                  value: e,
                });
              }}
            />
            <TextInput
              label="twitterTitle"
              value={selectedPage?.meta.twitterTitle || ""}
              onChange={(e) => {
                selectedPage.setMetaByKeyValue({
                  key: MetaEnum.twitterTitle,
                  value: e,
                });
              }}
            />
            <TextInput
              label="twitterDescription"
              value={selectedPage?.meta.twitterDescription || ""}
              onChange={(e) => {
                selectedPage.setMetaByKeyValue({
                  key: MetaEnum.twitterDescription,
                  value: e,
                });
              }}
            />
            <TextInput
              label="twitterImage"
              value={selectedPage?.meta.twitterImage || ""}
              onChange={(e) => {
                selectedPage.setMetaByKeyValue({
                  key: MetaEnum.twitterImage,
                  value: e,
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default MetaPanel;

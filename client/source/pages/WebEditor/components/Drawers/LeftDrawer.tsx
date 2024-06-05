"use client";
import styles from "./Drawer.module.scss";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import AstTagTreePanel from "../panels/AstTagTreePanel";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";
import NewNodePanel from "../panels/NewNodePanel";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { MdSnippetFolder } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import SnippetsPanel from "../panels/SnippetsPanel";
import MetaPanel from "../panels/MetaPanel";
import { SiMetabase } from "react-icons/si";

enum TabTypes {
  META = "META",
  SNIPPETS = "SNIPPETS",
  CHILDREN = "CHILDREN",
}

const tabs = [
  {
    type: TabTypes.META,
    label: "Meta",
    IconComponent: SiMetabase,
  },
  {
    type: TabTypes.SNIPPETS,
    label: "Snippets",
    IconComponent: MdSnippetFolder,
  },
  {
    type: TabTypes.CHILDREN,
    label: "Children",
    IconComponent: FaPlus,
  },
];

const LeftDrawer: React.FC = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { editor } = selectedPage;
  const node = editor.selectedAstNode;
  const [tabType, setTabType] = useState(TabTypes.CHILDREN);
  const handleTabTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    t: TabTypes | null
  ) => {
    if (t !== null) {
      setTabType(t);
    }
  };

  return (
    <div
      className={clsx([
        styles.drawer,
        {
          [styles.drawerOpen]: editor.isLeftDrawerOpen,
        },
      ])}
    >
      <div className={styles.drawerHeader}>
        <div className={styles.drawerTitle}>Navigator</div>
      </div>
      <div className={styles.drawerContentWrap}>
        <div className={styles.drawerPanelArea}>
          <AstTagTreePanel />
        </div>
      </div>
      <div className={styles.drawerFooterArea}>
        <div className={styles.drawerFooterContentWrap}>
          <div
            className={styles.drawerTabsArea}
            style={{ justifyContent: "flex-start" }}
          >
            <ToggleButtonGroup
              value={tabType}
              exclusive
              onChange={handleTabTypeChange}
              aria-label="left drawer panel tabs"
            >
              {tabs.map((tab) => {
                const { IconComponent, type } = tab;
                return (
                  <ToggleButton
                    size="small"
                    key={type}
                    value={type}
                    aria-label={`left drawer panel tab ${type}`}
                  >
                    <IconComponent />
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>
          </div>
          <div className={styles.drawerPanelArea}>
            {tabType === TabTypes.META && <MetaPanel />}
            {tabType === TabTypes.CHILDREN && <NewNodePanel />}
            {tabType === TabTypes.SNIPPETS && <SnippetsPanel />}
          </div>
        </div>
      </div>
    </div>
  );
});

export default LeftDrawer;

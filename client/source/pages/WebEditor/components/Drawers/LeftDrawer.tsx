"use client"
import styles from "./Drawer.module.scss";
import clsx from "clsx";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { FaPlus } from "react-icons/fa";
import { MdSnippetFolder } from "react-icons/md";
import { LuTableProperties } from "react-icons/lu";
import { SiMetabase } from "react-icons/si";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InfoPanel from "../panels/InfoPanel";
import NewNodePanel from "../panels/NewNodePanel";
import AstTagTreePanel from "../panels/AstTagTreePanel";
import SnippetsPanel from "../panels/SnippetsPanel";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";
import MetaPanel from "../panels/metaPanel";

enum TabTypes {
  META = "META",
  ATTRIBUTES = "ATTRIBUTES",
  CHILDREN = "CHILDREN",
  SNIPPETS = "SNIPPETS",
}
const tabs = [
  {
    type: TabTypes.META,
    label: "META",
    IconComponent: SiMetabase,
  },
  {
    type: TabTypes.SNIPPETS,
    label: "SNIPPETS",
    IconComponent: MdSnippetFolder,
  },
  {
    type: TabTypes.CHILDREN,
    label: "CHILDREN",
    IconComponent: FaPlus,
  },
  {
    type: TabTypes.ATTRIBUTES,
    label: "ATTRIBUTES",
    IconComponent: LuTableProperties,
  },
];

const LeftDrawer: React.FC = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { editor } = selectedPage;
  const node = editor.selectedAstNode;
  const [tabType, setTabType] = useState(TabTypes.ATTRIBUTES);
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
      <div className={styles.drawerContentWrap}>
        <div className={styles.drawerTabsArea}>
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
          {tabType === TabTypes.ATTRIBUTES &&
            (node ? (
              <InfoPanel />
            ) : (
              <div className={styles.drawerPanelAreaNoSelectedNode}>
                select node first
              </div>
            ))}
          {tabType === TabTypes.CHILDREN && <NewNodePanel />}
          {tabType === TabTypes.SNIPPETS && <SnippetsPanel />}
          {tabType === TabTypes.META && <MetaPanel />}
        </div>
        <div className={styles.drawerFooterArea}>
          <div className={styles.drawerPanelArea}>
            <AstTagTreePanel />
          </div>
        </div>
      </div>
    </div>
  );
});

export default LeftDrawer;

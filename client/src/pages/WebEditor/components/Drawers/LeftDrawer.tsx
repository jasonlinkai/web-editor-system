import styles from "./Drawer.module.scss";
import clsx from "clsx";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { FaPlus } from "react-icons/fa";
import { MdSnippetFolder } from "react-icons/md";
import { LuTableProperties } from "react-icons/lu";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import InfoPanel from "../panels/InfoPanel";
import NewNodePanel from "../panels/NewNodePanel";
import AstTagTreePanel from "../panels/AstTagTreePanel";
import SnippetsPanel from "../panels/SnippetsPanel";
import { useStores } from "@/libs/mobx/useMobxStateTreeStores";

enum TabTypes {
  ATTRIBUTES = "ATTRIBUTES",
  CHILDREN = "CHILDREN",
  SNIPPETS = "SNIPPETS",
}
const tabs = [
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
          <Tabs
            value={tabType}
            variant="scrollable"
            scrollButtons={true}
            onChange={(e: React.SyntheticEvent, v: TabTypes | null) => {
              if (v !== null) {
                setTabType(v);
              }
            }}
            aria-label="left drawer panel tabs"
          >
            {tabs.map((tab) => {
              const { IconComponent, type, label } = tab;
              return (
                <Tab
                  key={type}
                  label={label}
                  icon={<IconComponent />}
                  value={type}
                  aria-label={`left drawer panel tab ${type}`}
                />
              );
            })}
          </Tabs>
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

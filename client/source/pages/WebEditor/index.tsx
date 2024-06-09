"use client";
import styles from "./WebEditor.module.scss";
import ActionBar from "./components/ActionBar";
import LeftDrawer from "./components/Drawers/LeftDrawer";
import SizerBar from "./components/SizerBar";
import Renderer from "./Renderer";
import RightDrawer from "./components/Drawers/RightDrawer";
import UploadModal from "./components/Modals/UploadModal";
import PageLoading from "source/editor-components/PageLoading";
import { useStores } from "source/libs/mobx/useMobxStateTreeStores";
import { observer } from "mobx-react-lite";

const WebEditor: React.FC = observer(() => {
  const { selectedPage, isPostPageLoading } = useStores();
  if (!selectedPage) return null;
  return (
    <div id="web-editor" className={styles.webEditor}>
      <ActionBar />
      <div className={styles.webEditorMainArea}>
        <LeftDrawer />
        <div className={styles.webEditorMainAreaEditScreen}>
          <Renderer />
          <SizerBar />
        </div>
        <RightDrawer />
      </div>
      <UploadModal />
      <PageLoading visible={isPostPageLoading} />
    </div>
  );
});

export default WebEditor;

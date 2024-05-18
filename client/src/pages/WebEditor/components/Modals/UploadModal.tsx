import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useRef } from "react";
import { useStores } from "@/libs/mobx/useMobxStateTreeStores";
import Dialog, { DialogRefType } from "@/shared-components/Dialog";
import Upload from "../Upload";

const UploadModal = observer(() => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { editor } = selectedPage;
  const { isUploadModalVisible, setIsUploadModalVisible } = editor;
  const dialogRef = useRef<DialogRefType>(null);

  const onSuccess = useCallback((image: string) => {
    setIsUploadModalVisible(false);
    alert('upload success!')
  }, [setIsUploadModalVisible]);

  useEffect(() => {
    if (isUploadModalVisible) {
      dialogRef.current?.openDialog();
    } else {
      dialogRef.current?.closeDialog();
    }
  }, [isUploadModalVisible]);

  return (
    <Dialog
      ref={dialogRef}
      onClose={() => {
        setIsUploadModalVisible(false);
      }}
    >
      <Upload onSuccess={onSuccess} />
    </Dialog>
  );
});

export default UploadModal;

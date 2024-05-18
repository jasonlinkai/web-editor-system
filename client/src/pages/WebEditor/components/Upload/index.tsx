import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from '@mui/material/CircularProgress';
import { observer } from "mobx-react-lite";
import { useStores } from "@/libs/mobx/useMobxStateTreeStores";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface UploadProps {
  onSuccess?: (v: any) => void;
}
const Upload = observer(({ onSuccess }: UploadProps) => {
  const { selectedPage } = useStores();
  if (!selectedPage) return null;
  const { editor } = selectedPage;
  return (
    <Button
      disabled={editor.isUploadImageLoading}
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      onChange={async (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files[0]) {
          const file = files[0];
          const formData = new FormData();
          formData.append("file", file);
          try {
            const image = await editor.uploadImage(formData);
            onSuccess && onSuccess(image);
          } catch (e) {
            alert((e as Error).message);
          }
        }
      }}
    >
      {editor.isUploadImageLoading ? <CircularProgress size={24} /> : 'Upload Image'}
      <VisuallyHiddenInput type="file" />
    </Button>
  );
});

export default Upload;

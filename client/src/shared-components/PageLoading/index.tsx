import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

interface PageLoadingProps {
  visible: boolean;
}

const PageLoading: React.FC<PageLoadingProps> = ({ visible = false }) => {
  return (
    <Backdrop open={visible}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
};

export default PageLoading;

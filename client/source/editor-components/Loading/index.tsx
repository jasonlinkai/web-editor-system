import { CircularProgressProps } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

interface LoadingProps extends CircularProgressProps {}

const Loading: React.FC<LoadingProps> = (props) => {
  return <CircularProgress {...props} />;
};

export default Loading;

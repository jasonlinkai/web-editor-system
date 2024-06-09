import { useState } from "react";
import { ShadowPicker } from "react-shadow-picker";
import FormItem from "../FormItem";
import FormItemLabel from "../FormItemLabel";
import Popover from "@mui/material/Popover";

const ColorInput: React.FC<{
  label?: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, value, onChange, ...rest }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <FormItem>
      {label && <FormItemLabel>{label}</FormItemLabel>}
      <div
        style={{
          width: "1.2rem",
          height: "1.2rem",
          padding: "2.5px",
          border: "1px #d8d8d8 solid",
          borderRadius: "5px",
          boxShadow: value,
        }}
        onClick={handleClick}
      >
        <div
          style={{
            backgroundColor: "transparent",
            width: "100%",
            height: "100%",
          }}
        ></div>
      </div>
      <Popover
        id={label}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ShadowPicker
          value={value}
          onChange={(v) => {
            onChange && onChange(v);
          }}
        />
      </Popover>
    </FormItem>
  );
};

export default ColorInput;

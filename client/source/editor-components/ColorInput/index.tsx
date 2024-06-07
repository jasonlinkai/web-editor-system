import { useLayoutEffect, useState } from "react";
import { RgbaColor, RgbaColorPicker } from "react-colorful";
import { ColorPickerBaseProps } from "react-colorful/dist/types";
import FormItem from "../FormItem";
import FormItemLabel from "../FormItemLabel";
import Popover from "@mui/material/Popover";

function parse_rgb_string(rgb: string) {
  return rgb.replace(/[^\d,]/g, "").split(",");
}

const ColorInput: React.FC<
  Omit<Partial<ColorPickerBaseProps<RgbaColor>>, "onChange"> & {
    label?: string;
    value: string;
    onChange: (v: string) => void;
  }
> = ({ label, value, onChange, ...rest }) => {
  const [innerPrimitiveValue, setInnerPrimitiveValue] = useState(
    "rgba(255, 255, 255, 1)"
  );
  const [innerValue, setInnerValue] = useState<RgbaColor>({
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  });
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useLayoutEffect(() => {
    if (value && value !== innerPrimitiveValue) {
      setInnerPrimitiveValue(value);
      const [r, g, b, a] = parse_rgb_string(value);
      setInnerValue({
        r: Number(r || 0),
        g: Number(g || 0),
        b: Number(b || 0),
        a: Number(a || 0),
      });
    }
  }, [value, innerPrimitiveValue]);

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
        }}
        onClick={handleClick}
      >
        <div
          style={{
            backgroundColor: innerPrimitiveValue,
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
        <RgbaColorPicker
          {...rest}
          color={innerValue}
          onChange={(newColor) => {
            const primitiveNewValue = `rgba(${newColor.r}, ${newColor.g}, ${newColor.b}, ${newColor.a})`;
            setInnerPrimitiveValue(primitiveNewValue);
            setInnerValue(newColor);
            onChange && onChange(primitiveNewValue);
          }}
        />
      </Popover>
    </FormItem>
  );
};

export default ColorInput;

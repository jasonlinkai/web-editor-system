import FormItem from "../FormItem";
import FormItemLabel from "../FormItemLabel";
import CoreSelect from "./core";

interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
  options?: { label: string; value: string }[];
}

const Select = (props: SelectProps) => {
  return (
    <FormItem>
      {props.label && <FormItemLabel>{props.label}</FormItemLabel>}
      <CoreSelect
        {...props}
        onChange={(e) => {
          props?.onChange && props.onChange(e.target.value);
        }}
      />
    </FormItem>
  );
};

export default Select;

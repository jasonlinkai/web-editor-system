import { useLayoutEffect, useState } from "react";
import styles from "./Input.module.scss";
import FormItem from "../FormItem";
import FormItemLabel from "../FormItemLabel";
import { styled, TextField } from "@mui/material";
import CoreSelect from "../Select/core";
import { makeOptions } from "@/libs/utils";

enum UnitSignType {
  "%" = "%",
  "rem" = "rem",
  "em" = "em",
  "px" = "px",
  "vw" = "vw",
  "vh" = "vh",
  "ch" = "ch",
  "svw" = "svw",
  "svh" = "svh",
}

type UnitSignValueType = UnitSignType | "auto";

const unitSignValueArray = [...Object.values(UnitSignType), "auto"];

const InnerSizeInput = styled(TextField)({
  "& .MuiOutlinedInput-input": {
    flex: "1",
    width: "100%",
    height: "1.2rem",
    fontSize: "0.9rem",
    border: "0px",
    padding: "0px",
    paddingLeft: "10px !important",
    paddingRight: "0px !important",
    borderRadius: "5px",
    backgroundColor: "white",
  },
});

interface SizeInputProps {
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
}

const getUnitSignFromValue = (v: string): UnitSignType => {
  const result = /\d+/.exec(v);
  if (result !== null) {
    if (result.length !== v.length) {
      const valueUnit = v.split(result[0])[1] as UnitSignType;
      if (unitSignValueArray.includes(valueUnit)) {
        // is vaild unit sign
        return valueUnit;
      }
    }
  }
  return UnitSignType.px;
};

const SizeInput = ({
  label = "",
  value = "",
  onChange = (v) => console.log(v),
}: SizeInputProps) => {
  const [unit, setUnit] = useState<UnitSignValueType>(UnitSignType.px);

  useLayoutEffect(() => {
    if (value) {
      if (value === "auto") {
        setUnit("auto");
      } else {
        const unitSign = getUnitSignFromValue(value);
        setUnit(unitSign);
      }
    } else {
      setUnit(UnitSignType.px)
    }
  }, [value]);

  return (
    <FormItem>
      {label && <FormItemLabel>{label}</FormItemLabel>}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: "1",
          justifyContent: "flex-end",
        }}
      >
        {value !== "auto" && (
          <div style={{ flex: "0.6" }}>
            <InnerSizeInput
              type="number"
              className={styles.input}
              value={value.replace(unit, "")}
              onChange={(e) => {
                if (e.target.value) {
                  onChange(`${e.target.value}${unit}`);
                } else {
                  onChange("");
                }
              }}
            />
          </div>
        )}
        <div style={{ flex: "0.4" }}>
          <CoreSelect
            value={unit}
            onChange={(e) => {
              const v = e.target.value as UnitSignValueType;
              setUnit(v);
              if (v === "auto") {
                onChange(v);
              } else {
                if (value === "") {
                  // do nothing
                } else if (value === "auto") {
                  onChange(`10${v}`);
                } else {
                  onChange(`${value.replace(unit, "")}${v}`);
                }
              }
            }}
            options={makeOptions(unitSignValueArray)}
          />
        </div>
      </div>
    </FormItem>
  );
};

export default SizeInput;

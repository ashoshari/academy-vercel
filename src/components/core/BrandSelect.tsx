import { ChevronDown } from "lucide-react";
import Select, {
  components,
  type DropdownIndicatorProps,
  type GroupBase,
  type Props as ReactSelectProps,
  type StylesConfig,
} from "react-select";

export interface BrandSelectOption {
  value: string;
  label: string;
}

type BrandSelectSize = "sm" | "md";

export interface BrandSelectProps<
  Option extends BrandSelectOption = BrandSelectOption,
  IsMulti extends boolean = false,
> extends Omit<
  ReactSelectProps<Option, IsMulti, GroupBase<Option>>,
  "styles" | "classNamePrefix"
> {
  size?: BrandSelectSize;
  /** Minimum width of the control (default: 160px) */
  minWidth?: number | string;
}

const SIZE_MAP: Record<
  BrandSelectSize,
  { minHeight: number; fontSize: string; padding: string }
> = {
  sm: { minHeight: 34, fontSize: "0.8125rem", padding: "0 10px" },
  md: { minHeight: 40, fontSize: "0.875rem", padding: "0 12px" },
};

function DropdownIndicator<
  Option extends BrandSelectOption,
  IsMulti extends boolean = false,
>(
  props: DropdownIndicatorProps<Option, IsMulti, GroupBase<Option>>,
) {
  const open = props.selectProps.menuIsOpen;
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown
        className={`w-4 h-4 transition-transform duration-200 ${
          open ? "rotate-180 text-(--brand)" : "text-gray-400"
        }`}
      />
    </components.DropdownIndicator>
  );
}

function getBrandSelectStyles<
  Option extends BrandSelectOption,
  IsMulti extends boolean,
>(
  size: BrandSelectSize,
  minWidth: number | string,
): StylesConfig<Option, IsMulti, GroupBase<Option>> {
  const sizeConfig = SIZE_MAP[size];

  return {
    container: (base) => ({
      ...base,
      minWidth,
    }),
    control: (base, state) => ({
      ...base,
      minHeight: sizeConfig.minHeight,
      borderRadius: "0.625rem",
      borderColor: state.isFocused ? "var(--brand)" : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 1px var(--brand)" : "none",
      backgroundColor: "#fff",
      cursor: "pointer",
      transition: "border-color 150ms ease, box-shadow 150ms ease",
      "&:hover": {
        borderColor: state.isFocused ? "var(--brand)" : "#d1d5db",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: sizeConfig.padding,
      fontSize: sizeConfig.fontSize,
    }),
    singleValue: (base) => ({
      ...base,
      color: "var(--brand-secondary)",
      fontWeight: 500,
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
      fontWeight: 400,
    }),
    input: (base) => ({
      ...base,
      color: "var(--brand-secondary)",
      margin: 0,
      padding: 0,
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "0 10px",
      color: "transparent",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.75rem",
      overflow: "hidden",
      border: "1px solid #f0f0f3",
      boxShadow: "0 12px 32px rgb(0 0 0 / 0.1)",
      zIndex: 50,
      marginTop: 6,
    }),
    menuList: (base) => ({
      ...base,
      padding: 6,
      maxHeight: 280,
    }),
    option: (base, state) => ({
      ...base,
      fontSize: sizeConfig.fontSize,
      borderRadius: "0.5rem",
      padding: "10px 12px",
      cursor: "pointer",
      transition: "background-color 120ms ease, color 120ms ease",
      backgroundColor: state.isSelected
        ? "var(--brand)"
        : state.isFocused
          ? "color-mix(in srgb, var(--brand) 8%, white)"
          : "transparent",
      color: state.isSelected
        ? "#fff"
        : state.isFocused
          ? "var(--brand-secondary)"
          : "#4b5563",
      fontWeight: state.isSelected ? 600 : 400,
      ":active": {
        backgroundColor: state.isSelected
          ? "var(--brand)"
          : "color-mix(in srgb, var(--brand) 14%, white)",
      },
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: sizeConfig.fontSize,
      color: "#9ca3af",
    }),
  };
}

export default function BrandSelect<
  Option extends BrandSelectOption = BrandSelectOption,
  IsMulti extends boolean = false,
>({
  size = "md",
  minWidth = 160,
  isSearchable = false,
  menuPlacement = "auto",
  components: customComponents,
  ...props
}: BrandSelectProps<Option, IsMulti>) {
  return (
    <Select<Option, IsMulti, GroupBase<Option>>
      {...props}
      isSearchable={isSearchable}
      menuPlacement={menuPlacement}
      classNamePrefix="brand-select"
      styles={getBrandSelectStyles<Option, IsMulti>(size, minWidth)}
      components={{
        DropdownIndicator,
        ...customComponents,
      }}
    />
  );
}

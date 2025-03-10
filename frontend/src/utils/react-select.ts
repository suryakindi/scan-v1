import { StylesConfig } from "react-select";

export const styles: StylesConfig = {
  input: (base) => ({ ...base, margin: 0 }),
  singleValue: (base) => ({
    ...base,
    color: "#000000",
  }),
  multiValue: (base) => ({
    ...base,
    color: "#ffffff",
    backgroundColor: "#155dfc",
  }),
  multiValueRemove: (base) => ({
    ...base,
    borderRadius: 0,
    ":hover": { backgroundColor: "#1447e6" },
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBlock: 2,
  }),
  valueContainer: (base) => ({
    ...base,
    margin: 0,
    paddingInline: 10,
    paddingBlock: 4,
  }),
  control: (base, { menuIsOpen }) => {
    return {
      ...base,
      boxShadow: "none",
      minHeight: 0,
      borderColor: menuIsOpen ? "oklch(0.809 0.105 251.813)" : "#d1d5dc",
      ":hover": {
        borderColor: menuIsOpen ? "oklch(0.809 0.105 251.813)" : "#d1d5dc",
      },
    };
  },
  dropdownIndicator: (base) => ({
    ...base,
    padding: 0,
    color: "#d1d5dc",
    ":hover": { color: "#d1d5dc" },
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: 0,
    color: "#d1d5dc",
    ":hover": { color: "#d1d5dc" },
  }),
  loadingIndicator: (base) => ({
    ...base,
    padding: 0,
    color: "#d1d5dc",
    ":hover": { color: "#d1d5dc" },
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: "#d1d5dc",
    ":hover": { color: "#d1d5dc" },
  }),
  menu: (base, { placement }) => {
    return {
      ...base,
      boxShadow: "none",
      borderColor: "#d1d5dc",
      borderWidth: 1,
      overflow: "hidden",
      margin: 0,
      top: placement === "top" ? "auto" : "100%",
      bottom: placement === "top" ? "100%" : "auto",
    };
  },
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  option: (base) => ({
    ...base,
    paddingBlock: 4,
  }),
};

/**
 * Represents an option type with a value and label.
 * The value can be a string or number by default.
 */
type OptionType<T = string | number> = { value: T; label: string };

/**
 * Maps an array of objects into an array of option types.
 * The mapping is based on the specified keys for label and value.
 *
 * @param data - The array of objects to map.
 * @param keys - An object specifying which properties to use for label (`l`) and value (`v`).
 * @returns An array of option objects with `label` and `value` properties.
 */
export const mapOptions = <T, K1 extends keyof T, K2 extends keyof T>(
  data: T[],
  keys: { l: K1; v: K2 }
): OptionType<T[K2]>[] =>
  data.map((item) => ({
    value: item[keys.v],
    label: String(item[keys.l]),
  }));

/**
 * Finds an object in an array that matches the given query.
 * If `keys` is provided, the function returns only the selected properties.
 * Otherwise, it returns the full object.
 *
 * @param options - The array of objects to search through.
 * @param query - A partial object specifying the key-value pairs to match.
 * @param keys - Optional. An object mapping new keys to existing object properties.
 * @returns The found object with either the full structure or only the specified keys, or `null` if not found.
 */
export const findValue = <
  T extends object,
  K extends keyof T,
  M extends Record<string, K> | undefined
>(
  options: T[],
  query: Partial<T>,
  keys?: M
): (M extends Record<string, K> ? Record<keyof M, T[K]> : T) | null => {
  const found = options.find((item) =>
    Object.entries(query).every(
      ([key, value]) => item[key as keyof T] === value
    )
  );

  if (!found) return null;

  return (
    keys
      ? (Object.fromEntries(
          Object.entries(keys).map(([newKey, oldKey]) => [
            newKey,
            found[oldKey],
          ])
        ) as Record<keyof M, T[K]>)
      : (found as T)
  ) as (M extends Record<string, K> ? Record<keyof M, T[K]> : T) | null;
};

/**
 * Casts the selected value to the specified type and passes it to the setter function.
 *
 * @param selected - The value to be cast, initially of type `unknown`.
 * @param setter - An asynchronous or synchronous function that receives the casted value as type `T`.
 *
 * @example
 * cast<number>(value, async (num) => {
 *   await someAsyncFunction(num);
 *   console.log(num * 2);
 * });
 *
 * @example
 * cast<{ label: string; value: number }>(selectedOption, (option) => {
 *   console.log(option.label, option.value);
 * });
 */
export const cast = <T>(
  selected: unknown,
  setter: (option: T) => void | Promise<void>
) => {
  if (selected) setter(selected as T);
};

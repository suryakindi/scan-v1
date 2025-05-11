import { IconSearch } from "@tabler/icons-react";
import { FC, useRef } from "react";

type Props = {
  onSubmit?: (value: string) => void;
};

const SearchField: FC<Props> = ({ onSubmit }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBoxClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.target as HTMLElement).closest("button")) inputRef.current?.focus();
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (onSubmit) {
        onSubmit(inputRef.current?.value ?? "");
      }
      e.currentTarget.blur();
    }
  };
  const handleClick = () => {
    if (onSubmit) {
      onSubmit(inputRef.current?.value ?? "");
    }
  };

  return (
    <div
      className="border flex items-center h-11 px-[5px] rounded-sm border-gray-400 cursor-text hover:border-black focus-within:hover:border-indigo-700 focus-within:border-indigo-700 focus-within:ring focus-within:ring-inset focus-within:ring-indigo-700"
      onClick={searchBoxClickHandler}
    >
      <input
        type="text"
        placeholder="Search"
        className="placeholder:text-gray-400 flex-1 text-sm font-medium"
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />

      <button
        type="button"
        className="p-2.5 text-white bg-indigo-700 hover:bg-indigo-500 transition-all duration-300 rounded-sm cursor-pointer"
        onClick={handleClick}
      >
        <IconSearch className="size-3" />
      </button>
    </div>
  );
};

export default SearchField;

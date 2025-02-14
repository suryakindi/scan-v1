import {
  Button,
  Checkbox,
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Field,
  Input,
  Label,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverPanel,
  Switch,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Textarea,
} from "@headlessui/react";
import { FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";

const SearchableDropdown = ({
  options,
  label,
  id,
  selectedVal,
  handleChange,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, []);

  const selectOption = (option) => {
    setQuery(() => "");
    handleChange(option[label]);
    setIsOpen((isOpen) => !isOpen);
  };

  function toggle(e) {
    setIsOpen(e && e.target === inputRef.current);
  }

  const getDisplayValue = () => {
    if (query) return query;
    if (selectedVal) return selectedVal;

    return "";
  };

  const filter = (options) => {
    return options.filter(
      (option) => option[label].toLowerCase().indexOf(query.toLowerCase()) > -1
    );
  };

  return (
    <div className="dropdown">
      <div className="control">
        <div className="selected-value">
          <input
            ref={inputRef}
            type="text"
            value={getDisplayValue()}
            name="searchTerm"
            onChange={(e) => {
              setQuery(e.target.value);
              handleChange(null);
            }}
            onClick={toggle}
            style={{ borderRadius: "0.357rem" }}
            className="w-full outline-0 border border-gray-200"
          />
        </div>
        <div className={`arrow ${isOpen ? "open" : ""}`}></div>
      </div>

      <div className={`options ${isOpen ? "open" : ""}`}>
        {filter(options).map((option, index) => {
          return (
            <div
              onClick={() => selectOption(option)}
              className={`option ${
                option[label] === selectedVal ? "selected" : ""
              }`}
              key={`${id}-${index}`}
            >
              {option[label]}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Components: FC = () => {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const people = [
    { id: 1, name: "Durward Reynolds" },
    { id: 2, name: "Kenton Towne" },
    { id: 3, name: "Therese Wunsch" },
    { id: 4, name: "Benedict Kessler" },
    { id: 5, name: "Katelyn Rohan" },
  ];

  const [selectedPerson, setSelectedPerson] = useState<{
    id: number;
    name: string;
  } | null>(people[0]);
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase());
        });

  const [value, setValue] = useState("Select option...");

  const categories = [
    {
      name: "Recent",
      posts: [
        {
          id: 1,
          title: "Does drinking coffee make you smarter?",
          date: "5h ago",
          commentCount: 5,
          shareCount: 2,
        },
        {
          id: 2,
          title: "So you've bought coffee... now what?",
          date: "2h ago",
          commentCount: 3,
          shareCount: 2,
        },
      ],
    },
    {
      name: "Popular",
      posts: [
        {
          id: 1,
          title: "Is tech making coffee better or worse?",
          date: "Jan 7",
          commentCount: 29,
          shareCount: 16,
        },
        {
          id: 2,
          title: "The most innovative things happening in coffee",
          date: "Mar 19",
          commentCount: 24,
          shareCount: 12,
        },
      ],
    },
    {
      name: "Trending",
      posts: [
        {
          id: 1,
          title: "Ask Me Anything: 10 answers to your questions about coffee",
          date: "2d ago",
          commentCount: 9,
          shareCount: 5,
        },
        {
          id: 2,
          title: "The worst advice we've ever heard about coffee",
          date: "4d ago",
          commentCount: 1,
          shareCount: 2,
        },
      ],
    },
  ];

  const [enabled, setEnabled] = useState(true);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
          <Menu>
            <MenuButton className="inline-flex items-center gap-2 rounded-md bg-indigo-600 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-indigo-500 data-[open]:bg-indigo-500 cursor-pointer">
              <span>Options</span>
              <span className="ti-angle-down"></span>
            </MenuButton>

            <MenuItems
              transition
              anchor="bottom end"
              className="min-w-52 origin-top-right rounded-md border border-gray-200 bg-white p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              <MenuItem>
                <button className="group flex w-full items-center gap-2 rounded-sm py-1.5 px-3 data-[focus]:bg-gray-200 cursor-pointer">
                  <span className="ti-pencil"></span>
                  <span>Edit</span>
                  <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                    ⌘E
                  </kbd>
                </button>
              </MenuItem>
              <MenuItem>
                <button className="group flex w-full items-center gap-2 rounded-sm py-1.5 px-3 data-[focus]:bg-gray-200 cursor-pointer">
                  <span className="ti-layers"></span>
                  <span>Duplicate</span>
                  <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                    ⌘C
                  </kbd>
                </button>
              </MenuItem>
              <div className="my-1 h-px bg-black/5" />
              <MenuItem>
                <button className="group flex w-full items-center gap-2 rounded-sm py-1.5 px-3 data-[focus]:bg-gray-200 cursor-pointer">
                  <span className="ti-archive"></span>
                  <span>Archive</span>
                  <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                    ⌘A
                  </kbd>
                </button>
              </MenuItem>
              <MenuItem>
                <button className="group flex w-full items-center gap-2 rounded-sm py-1.5 px-3 data-[focus]:bg-gray-200 cursor-pointer">
                  <span className="ti-trash"></span>
                  <span>Delete</span>
                  <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                    ⌘D
                  </kbd>
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
        <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
          <Disclosure
            as="div"
            className="p-6 border border-gray-200 rounded-md"
            defaultOpen={true}
          >
            <DisclosureButton className="group flex w-full items-center justify-between cursor-pointer">
              <span className="text-sm/6 font-medium group-data-[hover]:text-black/80">
                What is your refund policy?
              </span>
              <span className="ti-angle-down fill-black/60 group-data-[hover]:fill-black/50 group-data-[open]:rotate-180"></span>
            </DisclosureButton>
            <DisclosurePanel className="mt-2 text-sm/5 text-black/50">
              If you're unhappy with your purchase, we'll refund you in full.
            </DisclosurePanel>
          </Disclosure>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
          <Button
            onClick={() => {
              setShowDialog(true);
            }}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-indigo-500 data-[open]:bg-indigo-500 cursor-pointer"
          >
            Open dialog
          </Button>

          <Dialog
            open={showDialog}
            as="div"
            className="relative z-10 focus:outline-none"
            onClose={() => {
              setShowDialog(false);
            }}
          >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 bg-black/15">
                <DialogPanel
                  transition
                  className="w-full max-w-md rounded-md bg-white border-1 border-gray-200 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                >
                  <DialogTitle as="h3" className="text-base/7 font-medium">
                    Payment successful
                  </DialogTitle>
                  <p className="mt-2 text-sm/6 text-black/50">
                    Your payment has been successfully submitted. We’ve sent you
                    an email with all of the details of your order.
                  </p>
                  <div className="mt-4">
                    <Button
                      className="inline-flex items-center gap-2 rounded-md bg-indigo-600 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-indigo-500 data-[open]:bg-indigo-500 cursor-pointer"
                      onClick={() => {
                        setShowDialog(false);
                      }}
                    >
                      Got it, thanks!
                    </Button>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        </div>
        <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
          <div className="flex gap-8">
            <div className="text-sm/6 font-semibold ">Products</div>
            <Popover>
              <PopoverButton className="block text-sm/6 font-semibold  focus:outline-none data-[active]:text-black/50 data-[hover]:text-black/50 data-[focus]:outline-1 data-[focus]:outline-black/50">
                Solutions
              </PopoverButton>
              <PopoverPanel
                transition
                anchor="bottom"
                className="divide-y divide-black/5 rounded-md border border-gray-200 bg-white text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
              >
                <div className="p-3">
                  <a
                    className="block rounded-sm py-2 px-3 transition hover:bg-gray-200"
                    href="#"
                  >
                    <p className="font-semibold">Insights</p>
                    <p className="">Measure actions your users take</p>
                  </a>
                  <a
                    className="block rounded-sm py-2 px-3 transition hover:bg-gray-200"
                    href="#"
                  >
                    <p className="font-semibold">Automations</p>
                    <p className="">Create your own targeted content</p>
                  </a>
                  <a
                    className="block rounded-sm py-2 px-3 transition hover:bg-gray-200"
                    href="#"
                  >
                    <p className="font-semibold">Reports</p>
                    <p className="">Keep track of your growth</p>
                  </a>
                </div>
                <div className="p-3">
                  <a
                    className="block rounded-sm py-2 px-3 transition hover:bg-gray-200"
                    href="#"
                  >
                    <p className="font-semibold">Documentation</p>
                    <p className="">Start integrating products and tools</p>
                  </a>
                </div>
              </PopoverPanel>
            </Popover>
            <div className="text-sm/6 font-semibold ">Pricing</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
          <Combobox
            value={selectedPerson}
            onChange={setSelectedPerson}
            onClose={() => setQuery("")}
          >
            <div className="flex items-center justify-center rounded-md bg-gray-50 outline-1 outline-gray-200 focus-within:outline-indigo-400">
              <ComboboxInput
                aria-label="Assignee"
                className="block w-full py-1.5 px-3 border-0 outline-0 text-sm/6"
                displayValue={(person: { id: number; name: string } | null) =>
                  person?.name ?? ""
                }
                onChange={(event) => setQuery(event.target.value)}
              />
              <ComboboxButton className="px-2 cursor-pointer">
                <span className="ti-angle-down"></span>
              </ComboboxButton>
            </div>
            <ComboboxOptions
              anchor="bottom start"
              className="border empty:invisible w-80"
            >
              {filteredPeople.map((person) => (
                <ComboboxOption
                  key={person.id}
                  value={person}
                  className="data-[focus]:bg-blue-100"
                >
                  {person.name}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Combobox>
        </div>
        <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
          <SearchableDropdown
            options={people}
            label="name"
            id="id"
            selectedVal={value}
            handleChange={(val) => setValue(val)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
          <TabGroup>
            <TabList className="flex gap-2">
              {categories.map(({ name }) => (
                <Tab
                  key={name}
                  className="rounded-md py-1 px-3 text-sm/6 font-semibold focus:outline-none bg-indigo-600 border border-indigo-600 data-[selected]:bg-white data-[selected]:text-indigo-600 text-white data-[hover]:bg-indigo-600/80"
                >
                  {name}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="mt-3">
              {categories.map(({ name, posts }) => (
                <TabPanel key={name} className="rounded-xl bg-black/5 p-3">
                  <ul>
                    {posts.map((post) => (
                      <li
                        key={post.id}
                        className="relative rounded-md p-3 text-sm/6 transition hover:bg-black/5"
                      >
                        <a href="#" className="font-semibold text-black">
                          <span className="absolute inset-0" />
                          {post.title}
                        </a>
                        <ul
                          className="flex gap-2 text-black/50"
                          aria-hidden="true"
                        >
                          <li>{post.date}</li>
                          <li aria-hidden="true">&middot;</li>
                          <li>{post.commentCount} comments</li>
                          <li aria-hidden="true">&middot;</li>
                          <li>{post.shareCount} shares</li>
                        </ul>
                      </li>
                    ))}
                  </ul>
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </div>
        <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
          <Checkbox
            checked={enabled}
            onChange={setEnabled}
            className="group size-6 aspect-square rounded-md p-1 ring-1 ring-indigo-600 data-[checked]:bg-indigo-600"
          >
            <span className="ti-check text-white"></span>
          </Checkbox>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
          <Field>
            <Label className="text-sm/6 font-medium">Name</Label>
            <Description className="text-sm/6">
              Use your real name so people will recognize you.
            </Description>
            <Input
              className={clsx(
                "mt-3 block w-full rounded-lg border-none bg-indigo-600/5 py-1.5 px-3 text-sm/6 text-indigo-600",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-indigo-600/25"
              )}
            />
          </Field>
        </div>
        <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-indigo-600/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-indigo-600 data-[checked]:bg-indigo-600/10"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-indigo-600 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
            />
          </Switch>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
          <Field>
            <Label className="text-sm/6 font-medium">Description</Label>
            <Description className="text-sm/6">
              This will be shown under the product title.
            </Description>
            <Textarea
              className={clsx(
                "mt-3 block w-full resize-none rounded-lg border-none bg-indigo-600/5 py-1.5 px-3 text-sm/6 text-indigo-600",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-indigo-600/25"
              )}
              rows={3}
            />
          </Field>
        </div>
        <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sequi
          asperiores nisi animi eos ab temporibus illo architecto excepturi ut!
          At laborum repellat itaque, repudiandae debitis recusandae molestias
          aperiam reiciendis.
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sequi
          asperiores nisi animi eos ab temporibus illo architecto excepturi ut!
          At laborum repellat itaque, repudiandae debitis recusandae molestias
          aperiam reiciendis.
        </div>
        <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sequi
          asperiores nisi animi eos ab temporibus illo architecto excepturi ut!
          At laborum repellat itaque, repudiandae debitis recusandae molestias
          aperiam reiciendis.
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sequi
          asperiores nisi animi eos ab temporibus illo architecto excepturi ut!
          At laborum repellat itaque, repudiandae debitis recusandae molestias
          aperiam reiciendis.
        </div>
        <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sequi
          asperiores nisi animi eos ab temporibus illo architecto excepturi ut!
          At laborum repellat itaque, repudiandae debitis recusandae molestias
          aperiam reiciendis.
        </div>
      </div>
    </div>
  );
};

export default Components;

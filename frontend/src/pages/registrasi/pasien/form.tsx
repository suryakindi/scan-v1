import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { FC } from "react";
import Select from "react-select";
import { styles } from "../../../utils/react-select";
import { options } from "../../../mock/react-select";
import clsx from "clsx";
import { Link } from "react-router";

const FormPasien: FC = () => {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow-lg p-6 rounded-md flex items-center">
          <div className="flex">
            <div className="size-28 aspect-square">
              <img src="/images/userL.png" alt="user.." />
            </div>
            <div className="ml-3">
              <div className="flex flex-col mb-3">
                <span className="font-medium">John Doe</span>
                <span>0001880961221</span>
              </div>
              <button
                type="button"
                className="flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white cursor-pointer rounded-sm"
              >
                Aktif
              </button>
            </div>
          </div>
        </div>
        <TabGroup>
          <TabList>
            <Tab className="mr-2 cursor-pointer outline-none rounded-sm px-4 py-2 data-[selected]:text-white data-[selected]:bg-gray-600 data-[selected]:font-semibold data-[hover]:bg-gray-300">
              Poliklinik
            </Tab>
          </TabList>
          <TabPanels className="mt-4">
            {/* profile */}
            <TabPanel className="grid grid-cols-1 gap-6 auto-rows-min">
              <form
                autoComplete="off"
                onSubmit={(e) => e.preventDefault()}
                className="grid grid-cols-1 gap-6 auto-rows-min"
              >
                <div className="bg-white shadow-lg p-6 rounded-md grid grid-cols-1 gap-4 auto-rows-min">
                  <div className="flex flex-col">
                    <label className="mb-1" htmlFor="poliklinik-tanggal">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      id="poliklinik-tanggal"
                      required={true}
                      className={clsx(
                        "border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300",
                        "disabled:bg-gray-200/80 disabled:active:border-gray-300 disabled:focus:border-gray-300"
                      )}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1" htmlFor="poliklinik-klinik">
                      Klinik
                    </label>
                    <Select
                      inputId="poliklinik-klinik"
                      className="w-full"
                      isClearable={true}
                      isSearchable={true}
                      styles={styles}
                      placeholder="Pilih..."
                      menuPlacement="bottom"
                      required={true}
                      options={options}
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="mb-1">Jaminan</span>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer rounded-sm"
                      >
                        JKN
                      </button>
                      <button
                        type="button"
                        className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer rounded-sm"
                      >
                        NON JKN
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white cursor-pointer rounded-sm"
                  >
                    Daftar
                  </button>
                </div>
              </form>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>

      <div className="flex justify-end">
        <Link
          to="/registrasi/list"
          className="flex items-center px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white cursor-pointer rounded-sm"
        >
          Kembali
        </Link>
      </div>
    </div>
  );
};

export default FormPasien;

import clsx from "clsx";
import { FC, Fragment, useState } from "react";
import Select from "react-select";
import Modal from "../../components/modal/Modal";
import { styles } from "../../utils/react-select";
import { options } from "../../mock/react-select";
import * as HSolid from "@heroicons/react/24/solid";

const Viewer: FC = () => {
  const [showModalPoli, setShowModalPoli] = useState<boolean>(false);

  return (
    <Fragment>
      <div className="flex items-center justify-center p-6">
        <div className="w-1/3 grid grid-cols-1 items-center gap-6">
          <div className="flex justify-center">
            <div className="w-28">
              <img src="/images/logo_bg_transparent.png" alt="logo" />
            </div>
          </div>
          <div className="flex justify-center">
            <span className="text-3xl font-bold">
              SCAN Nusantara Queuing System
            </span>
          </div>
          <div className="flex justify-center">
            <img src="/images/viewer-bg.png" alt="viewer-bg" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              className={clsx(
                "flex items-center justify-center px-3 py-1.5 text-white cursor-pointer rounded-full font-bold",
                "bg-purple-600 hover:bg-purple-500"
              )}
            >
              Pemanggil
            </button>
            <button
              type="button"
              className={clsx(
                "flex items-center justify-center px-3 py-1.5 text-white cursor-pointer rounded-full font-bold",
                "bg-cyan-600 hover:bg-cyan-500"
              )}
            >
              Pendaftaran
            </button>
            <button
              type="button"
              className={clsx(
                "flex items-center justify-center px-3 py-1.5 text-white cursor-pointer rounded-full font-bold",
                "bg-orange-600 hover:bg-orange-500"
              )}
              onClick={() => setShowModalPoli(true)}
            >
              Poli
            </button>
            <button
              type="button"
              className={clsx(
                "flex items-center justify-center px-3 py-1.5 text-white cursor-pointer rounded-full font-bold",
                "bg-teal-600 hover:bg-teal-500"
              )}
            >
              Farmasi
            </button>
            <button
              type="button"
              className={clsx(
                "flex items-center justify-center px-3 py-1.5 text-white cursor-pointer rounded-full font-bold",
                "bg-green-600 hover:bg-green-500"
              )}
            >
              Operasi
            </button>
            <button
              type="button"
              className={clsx(
                "flex items-center justify-center px-3 py-1.5 text-white cursor-pointer rounded-full font-bold",
                "bg-indigo-600 hover:bg-indigo-500"
              )}
            >
              Informasi Bed
            </button>
            <button
              type="button"
              className={clsx(
                "flex items-center justify-center px-3 py-1.5 text-white cursor-pointer rounded-full font-bold",
                "bg-amber-600 hover:bg-amber-500",
                "col-span-3"
              )}
            >
              Lab
            </button>
          </div>
        </div>
      </div>

      <Modal show={showModalPoli} onClose={() => setShowModalPoli(false)}>
        <div className="grid grid-cols-1 gap-4 auto-rows-min">
          <div className="flex">
            <span className="font-medium">Pilih Poli</span>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="grid grid-cols-1 gap-4 auto-rows-min"
          >
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="nama-poli">
                Nama Poli
              </label>
              <Select
                inputId="nama-poli"
                className="w-full"
                isClearable={true}
                closeMenuOnSelect={false}
                isSearchable={true}
                styles={styles}
                placeholder="Pilih..."
                menuPlacement="bottom"
                required={true}
                isMulti={true}
                options={options}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1" htmlFor="nama-dokter">
                Pilih Dokter
              </label>
              <Select
                inputId="nama-dokter"
                className="w-full"
                isClearable={true}
                closeMenuOnSelect={false}
                isSearchable={true}
                styles={styles}
                placeholder="Pilih..."
                menuPlacement="bottom"
                required={true}
                isMulti={true}
                options={options}
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white cursor-pointer rounded-sm"
              >
                <HSolid.CheckIcon className="size-6 mr-2" />
                <span>Simpan</span>
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </Fragment>
  );
};

export default Viewer;

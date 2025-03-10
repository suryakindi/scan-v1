import { FC, Fragment, useState } from "react";
import Modal from "../../../components/modal/Modal";
import * as HSolid from "@heroicons/react/24/solid";
import Select from "react-select";
import { styles } from "../../../utils/react-select";
import { options } from "../../../mock/react-select";

const AntreanPasien: FC = () => {
  const [showModalPoli, setShowModalPoli] = useState<boolean>(false);

  return (
    <Fragment>
      <div className="flex">
        <button
          type="button"
          className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer rounded-sm"
          onClick={() => setShowModalPoli(true)}
        >
          Show Modal
        </button>
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

export default AntreanPasien;

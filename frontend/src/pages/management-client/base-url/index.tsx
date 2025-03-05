import { FC, FormEventHandler, Fragment, useState } from "react";
import * as HeroSolid from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import { ResponseT, useXState } from "../../../utils/api";
import { BaseURLT } from "./types";
import Modal from "../../../components/modal/Modal";
import { useOutletContext } from "react-router";
import { LayoutContext } from "../../../layout/types";

const BaseURL: FC = () => {
  const { setIsProcess } = useOutletContext<LayoutContext>();
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
  const [addForm, setAddForm, addFormFn] = useXState<
    {
      base_url: string;
      kdAplikasi: string;
    },
    ResponseT<BaseURLT>
  >(
    { base_url: "", kdAplikasi: "0" },
    { url: "/integerasi-sistem/create-base-url", method: "POST" }
  );

  const handleAddFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setIsProcess(true);
      const response = await addFormFn.submit();
      console.log(response);
      Swal.fire({
        timer: 1000,
        position: "top-right",
        showConfirmButton: false,
        toast: true,
        icon: "success",
        title: "Berhasil menambah",
        text: "Berhasil menambah data",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        timer: 1000,
        position: "top-right",
        showConfirmButton: false,
        toast: true,
        icon: "error",
        title: "Gagal menambah",
        text: "Gagal menambah data",
      });
    } finally {
      setShowModalAdd(false);
      setIsProcess(false);
    }
  };

  return (
    <Fragment>
      <div className="bg-white shadow-lg p-6 rounded-md mb-6 grid gap-4 auto-rows-min">
        <div className="flex items-center justify-end">
          <button
            type="button"
            className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer rounded-sm"
            onClick={() => setShowModalAdd(true)}
          >
            <HeroSolid.PlusIcon className="size-6 mr-2" />
            <span className="">Tambah URL</span>
          </button>
        </div>

        <table className="me-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>Base URL</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }, (_, k) => (
              <tr key={k}>
                <td>{k}</td>
                <td>base url {k}</td>
                <td>aksi {k}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModalAdd} onClose={() => setShowModalAdd(false)}>
        <div className="grid grid-cols-1 gap-4 auto-rows-min">
          <div className="flex">
            <span className="font-medium">Tambah URL</span>
          </div>

          <form
            onSubmit={handleAddFormSubmit}
            className="grid grid-cols-1 gap-4 auto-rows-min"
          >
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="satusehat-client-key">
                URL
              </label>
              <input
                type="text"
                id="satusehat-client-key"
                className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                value={addForm.base_url}
                onChange={(e) =>
                  setAddForm({ base_url: e.currentTarget.value })
                }
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="flex items-center px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white cursor-pointer rounded-sm ml-4"
                onClick={() => setShowModalAdd(false)}
              >
                <HeroSolid.XMarkIcon className="size-6 mr-2" />
                <span>Batal</span>
              </button>

              <button
                type="submit"
                className="flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white cursor-pointer rounded-sm ml-4"
              >
                <HeroSolid.CheckIcon className="size-6 mr-2" />
                <span>Simpan</span>
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </Fragment>
  );
};

export default BaseURL;

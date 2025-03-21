import { FC, FormEventHandler, Fragment, useEffect, useState } from "react";
import * as HeroSolid from "@heroicons/react/24/solid";
import { api, ResponseT, useXState } from "../../../utils/api";
import { BaseURLT } from "./types";
import Modal from "../../../components/modal/Modal";
import { useOutletContext } from "react-router";
import { LayoutContext } from "../../../layout/types";
import * as HOutline from "@heroicons/react/24/outline";
import { Toast } from "../../../utils/alert";

const BaseURL: FC = () => {
  const { setIsProcess } = useOutletContext<LayoutContext>();

  const [dataUrls, setDataUrls] = useState<BaseURLT[]>([]);
  const getDataUrls = async () => {
    try {
      setIsProcess(true);
      const response = await api.get<ResponseT<BaseURLT[]>>(
        "/integerasi-sistem/get-base-url"
      );
      if (response.data.data) {
        setDataUrls(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcess(false);
    }
  };

  useEffect(() => {
    getDataUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      await addFormFn.submit();
      await getDataUrls();
      Toast.fire({
        icon: "success",
        title: "Berhasil",
        text: "Berhasil menambah data",
      });
    } catch (error) {
      console.error(error);
      Toast.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menambah data",
      });
    } finally {
      setShowModalAdd(false);
      setIsProcess(false);
    }
  };

  const [showModalUpdate, setShowModalUpdate] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<string | number>("");
  const [updateForm, setUpdateForm, updateFormFn] = useXState<
    {
      base_url: string;
      kdAplikasi: string;
    },
    ResponseT<BaseURLT>
  >(
    { base_url: "", kdAplikasi: "0" },
    { url: `/integerasi-sistem/edit-base-url/${updateId}`, method: "PUT" }
  );

  const handleUpdateFormSubmit: FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    try {
      setIsProcess(true);
      await updateFormFn.submit();
      await getDataUrls();
      Toast.fire({
        icon: "success",
        title: "Berhasil",
        text: "Berhasil mengubah data",
      });
    } catch (error) {
      console.error(error);
      Toast.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengubah data",
      });
    } finally {
      setShowModalUpdate(false);
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
              <th>Kode Aplikasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataUrls.map((item, key) => (
              <tr key={key}>
                <td>{key + 1}</td>
                <td>{item.base_url}</td>
                <td>{item.kdAplikasi}</td>
                <td>
                  <div className="flex gap-2 w-full items-center justify-center">
                    <button
                      type="button"
                      className="p-1.5 bg-cyan-500 hover:bg-cyan-400 text-white aspect-square rounded-md flex items-center justify-center outline-none cursor-pointer"
                      onClick={() => {
                        setShowModalUpdate(true);
                        setUpdateId(item.id);
                        setUpdateForm({
                          base_url: item.base_url,
                          kdAplikasi: item.kdAplikasi,
                        });
                      }}
                    >
                      <HOutline.PencilSquareIcon className="size-6" />
                    </button>
                  </div>
                </td>
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
              <label className="mb-1" htmlFor="add-url">
                URL
              </label>
              <input
                type="text"
                id="add-url"
                className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                value={addForm.base_url}
                onChange={(e) =>
                  setAddForm({ base_url: e.currentTarget.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1" htmlFor="add-kd-aplikasi">
                Kode Aplikasi
              </label>
              <input
                type="text"
                id="add-kd-aplikasi"
                className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                value={addForm.kdAplikasi}
                onChange={(e) =>
                  setAddForm({ kdAplikasi: e.currentTarget.value })
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

      <Modal show={showModalUpdate} onClose={() => setShowModalUpdate(false)}>
        <div className="grid grid-cols-1 gap-4 auto-rows-min">
          <div className="flex">
            <span className="font-medium">Ubah URL</span>
          </div>

          <form
            onSubmit={handleUpdateFormSubmit}
            className="grid grid-cols-1 gap-4 auto-rows-min"
          >
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="update-url">
                URL
              </label>
              <input
                type="text"
                id="update-url"
                className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                value={updateForm.base_url}
                onChange={(e) =>
                  setUpdateForm({ base_url: e.currentTarget.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1" htmlFor="update-kd-aplikasi">
                Kode Aplikasi
              </label>
              <input
                type="text"
                id="update-kd-aplikasi"
                className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                value={updateForm.kdAplikasi}
                onChange={(e) =>
                  setUpdateForm({ kdAplikasi: e.currentTarget.value })
                }
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="flex items-center px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white cursor-pointer rounded-sm ml-4"
                onClick={() => setShowModalUpdate(false)}
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

import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconExclamationCircle,
  IconPencil,
} from "@tabler/icons-react";
import {
  FC,
  FormEventHandler,
  Fragment,
  JSX,
  useEffect,
  useState,
} from "react";
import service, { type BaseURLPayload } from "./service";
import { useSelector } from "react-redux";
import { AppState } from "@/utils/state";
import type { BaseURLObject, XHRStatus } from "@/utils/global-types";
import Spinner from "@/components/spinner";
import { AddButton, SearchField } from "@/components/table";
import Modal from "@/components/modal";
import Button from "@/components/button";

const BaseURL: FC = () => {
  const token = useSelector((state: AppState) => state.token);
  const [data, setData] = useState<BaseURLObject[]>([]);
  const [xhrStatus, setXhrStatus] = useState<XHRStatus>("loading");
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
  const [addBaseUrl, setAddBaseUrl] = useState<BaseURLPayload>(
    service.initBaseURLPayload()
  );
  const [idForEditBaseUrl, setIdForEditBaseUrl] = useState<number>(0);
  const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
  const [editBaseUrl, setEditBaseUrl] = useState<BaseURLPayload>(
    service.initBaseURLPayload()
  );

  const preload = async () =>
    await service
      .getData(token)
      .then(({ data }) => {
        if (data.data) {
          setData(data.data);
          setXhrStatus("success");
        } else {
          setXhrStatus("error");
        }
      })
      .catch(() => {
        setXhrStatus("error");
      });

  const handleAddBaseUrl: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault();
      const response = await service.addData(token, addBaseUrl);
      console.log(response);
      await preload();
    } catch (error) {
      console.error(error);
    } finally {
      setShowModalAdd(false);
    }
  };

  const handleEditBaseUrl: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault();
      const response = await service.editData(
        token,
        idForEditBaseUrl,
        editBaseUrl
      );
      console.log(response);
      await preload();
    } catch (error) {
      console.error(error);
    } finally {
      setShowModalEdit(false);
    }
  };

  useEffect(() => {
    preload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <div className="flex flex-1 flex-col">
        <div className="bg-white rounded-md overflow-hidden flex flex-col">
          <div className="p-5 flex items-center justify-between">
            <span className="font-medium text-xl">Base URL</span>
            <div className="flex items-center gap-2.5">
              <SearchField />
              <AddButton onClick={() => setShowModalAdd(true)} />
            </div>
          </div>
          <div className="max-h-[70vh] overflow-y-scroll">
            <table className="w-full sticky-header-table text-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Base URL</th>
                  <th>Kode Aplikasi</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {
                  (
                    {
                      error: (
                        <tr>
                          <td colSpan={4} className="text-center">
                            <div className="flex items-center justify-center gap-2.5">
                              <IconExclamationCircle className="size-6" />
                              <span>Error loading data</span>
                            </div>
                          </td>
                        </tr>
                      ),
                      loading: (
                        <tr>
                          <td colSpan={4} className="text-center">
                            <div className="flex items-center justify-center gap-2.5">
                              <Spinner />
                              <span>Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ),
                      success:
                        data.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center">
                              <div className="flex items-center justify-center gap-2.5">
                                <IconExclamationCircle className="size-6" />
                                <span>Data masih kosong</span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          data.map((item, k) => (
                            <tr key={k}>
                              <td>{k + 1}</td>
                              <td>{item.base_url}</td>
                              <td>{item.kdAplikasi}</td>
                              <td>
                                <button
                                  type="button"
                                  className="cursor-pointer text-white bg-indigo-700 hover:bg-indigo-500 hover:scale-110 transition-all duration-300 rounded-sm p-2.5"
                                  onClick={() => {
                                    setShowModalEdit(true);
                                    setIdForEditBaseUrl(item.id);
                                    setEditBaseUrl({
                                      base_url: item.base_url,
                                      kdAplikasi: item.kdAplikasi,
                                    });
                                  }}
                                >
                                  <IconPencil className="size-6" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ),
                    } as Record<XHRStatus, JSX.Element>
                  )[xhrStatus]
                }
              </tbody>
            </table>
          </div>
          <div className="p-5 flex items-center justify-end">
            <div className="flex items-center gap-5">
              <span>Rows per page</span>
              <select>
                {[10, 25, 100].map((i) => (
                  <option value={i} key={i}>
                    {i}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="cursor-pointer hover:bg-slate-200 p-2 flex items-center justify-center rounded-full"
                >
                  <IconChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  className="cursor-pointer hover:bg-slate-200 p-2 flex items-center justify-center rounded-full"
                >
                  <IconChevronRight className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* add */}
      <Modal show={showModalAdd} onClose={() => setShowModalAdd(false)}>
        <form className="flex flex-col gap-5" onSubmit={handleAddBaseUrl}>
          <div>
            <label htmlFor="url" className="block mb-1 text-sm font-medium">
              URL
            </label>
            <input
              type="text"
              id="url"
              className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
              placeholder="URL"
              required
              value={addBaseUrl.base_url}
              onChange={({ currentTarget: { value } }) =>
                setAddBaseUrl((prev) => ({ ...prev, base_url: value }))
              }
            />
          </div>
          <div>
            <label
              htmlFor="kode-aplikasi"
              className="block mb-1 text-sm font-medium"
            >
              Kode Aplikasi
            </label>
            <input
              type="text"
              id="kode-aplikasi"
              className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
              placeholder="Kode Aplikasi"
              required
              value={addBaseUrl.kdAplikasi}
              onChange={({ currentTarget: { value } }) =>
                setAddBaseUrl((prev) => ({ ...prev, kdAplikasi: value }))
              }
            />
          </div>
          <div className="flex items-center justify-end">
            <Button type="submit">
              <IconCheck className="size-6" />
            </Button>
          </div>
        </form>
      </Modal>

      {/* edit */}
      <Modal show={showModalEdit} onClose={() => setShowModalEdit(false)}>
        <form className="flex flex-col gap-5" onSubmit={handleEditBaseUrl}>
          <div>
            <label htmlFor="url" className="block mb-1 text-sm font-medium">
              URL
            </label>
            <input
              type="text"
              id="url"
              className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
              placeholder="URL"
              required
              value={editBaseUrl.base_url}
              onChange={({ currentTarget: { value } }) =>
                setEditBaseUrl((prev) => ({ ...prev, base_url: value }))
              }
            />
          </div>
          <div>
            <label
              htmlFor="kode-aplikasi"
              className="block mb-1 text-sm font-medium"
            >
              Kode Aplikasi
            </label>
            <input
              type="text"
              id="kode-aplikasi"
              className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
              placeholder="Kode Aplikasi"
              required
              value={editBaseUrl.kdAplikasi}
              onChange={({ currentTarget: { value } }) =>
                setEditBaseUrl((prev) => ({ ...prev, kdAplikasi: value }))
              }
            />
          </div>
          <div className="flex items-center justify-end">
            <Button type="submit">
              <IconCheck className="size-6" />
            </Button>
          </div>
        </form>
      </Modal>
    </Fragment>
  );
};

export default BaseURL;

import { FC, useEffect, useState } from "react";
import { Link, useLoaderData, useOutletContext } from "react-router";
import { AxiosRequestConfig } from "axios";
import * as HOutline from "@heroicons/react/24/outline";
import { api, ResponseT } from "../../../utils/api";
import { LoaderT } from "../../../user";
import { ClientT } from "./types";
import { PaginateT } from "../../../utils/paginate";
import { Alert, Confirm, Toast } from "../../../utils/alert";
import { LayoutContext } from "../../../layout/types";

const ManagementClient: FC = () => {
  const { token, permission } = useLoaderData<LoaderT>();
  const [data, setData] = useState<PaginateT<ClientT[]> | null>(null);
  const { setIsProcess } = useOutletContext<LayoutContext>();

  const requestConfig: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const getAllClient = async () => {
    try {
      setIsProcess(true);
      const response = await api.get<ResponseT<PaginateT<ClientT[]>>>(
        "/management/get-clients",
        requestConfig
      );

      if (response.data.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcess(false);
    }
  };

  useEffect(() => {
    getAllClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string | number) => {
    Confirm.fire({ title: "Hapus client", text: "Hapus client ?" }).then(
      async ({ isConfirmed }) => {
        if (isConfirmed) {
          try {
            setIsProcess(true);
            await api.delete(`/management/delete-client/${id}`, requestConfig);
            Toast.fire({
              icon: "success",
              title: "Berhasil",
              text: "Berhasil menghapus data",
            });
          } catch (error) {
            console.error(error);
            Alert.fire({
              icon: "error",
              title: "Gagal",
              text: "Terjadi error saat menghapus data",
            });
          } finally {
            await getAllClient();
            setIsProcess(false);
          }
        }
      }
    );
  };

  return (
    <>
      <div className="bg-white shadow-lg p-6 rounded-md mb-6">
        <div className="grid-cols-1 w-full">
          <div className="flex justify-end mb-4">
            {permission.can_create && (
              <Link
                to="/management-client/client/add"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer rounded-sm flex items-center"
              >
                <HOutline.PlusIcon className="size-6 mr-2" />
                <span>Tambah</span>
              </Link>
            )}
          </div>

          <div className="w-full overflow-auto">
            <table className="me-table">
              <thead>
                <tr>
                  <th>NO</th>
                  <th>NAMA FASKES</th>
                  <th>KAB/KOTA</th>
                  <th>BPJS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {data && data.data.length > 0 ? (
                  data.data.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{item.nama_client}</td>
                      <td>{item.alamat}</td>
                      <td>{item.connect_bpjs}</td>
                      <td>
                        <div className="flex gap-2 w-full items-center justify-center">
                          <Link
                            to={`/management-client/client/details/${item.id}`}
                            className="p-1.5 bg-cyan-500 hover:bg-cyan-400 text-white aspect-square rounded-md flex items-center justify-center outline-none"
                          >
                            <HOutline.QuestionMarkCircleIcon className="size-6" />
                          </Link>

                          <button
                            type="button"
                            className="p-1.5 bg-red-600 hover:bg-red-500 text-white aspect-square rounded-md flex items-center justify-center outline-none cursor-pointer"
                            onClick={() => handleDelete(item.id)}
                          >
                            <HOutline.TrashIcon className="size-6" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>Empty of data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagementClient;

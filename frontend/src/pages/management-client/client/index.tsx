import { FC, useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { AxiosRequestConfig } from "axios";
import Swal from "sweetalert2";
import * as HOutline from "@heroicons/react/24/outline";
import { api, ResponseT } from "../../../utils/api";
import { LoaderT } from "../../../user";
import { ClientT } from "./types";
import { PaginateT } from "../../../utils/paginate";

const ManagementClient: FC = () => {
  const { token, permission } = useLoaderData<LoaderT>();
  const [data, setData] = useState<PaginateT<ClientT[]> | null>(null);

  const requestConfig: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const getAllClient = async () => {
    try {
      const response = await api.get<ResponseT<PaginateT<ClientT[]>>>(
        "/management/get-clients",
        requestConfig
      );

      if (response.data.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {
      getAllClient();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string | number) => {
    try {
      if (confirm("Hapus")) {
        const response = await api.delete(
          `/management/delete-client/${id}`,
          requestConfig
        );
        console.log(response);

        Swal.fire({
          timer: 1000,
          position: "top-right",
          showConfirmButton: false,
          toast: true,
          icon: "success",
          title: "Berhasil menghapus",
          text: "Berhasil menghapus data",
        });
      }
    } catch (error) {
      Swal.fire({
        timer: 1000,
        showConfirmButton: false,
        position: "top-right",
        toast: true,
        icon: "error",
        title: "Gagal menghapus",
        text: "Terjadi error saat menghapus data",
      });
      console.error(error);
    }
  };

  return (
    <>
      <div className="card">
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
                            className="btn btn-info btn-sm"
                          >
                            <span className="ti-help"></span>
                          </Link>

                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            <span className="ti-trash"></span>
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

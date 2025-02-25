import { FC, useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useLoaderData } from "react-router";
import { Dialog, DialogTitle } from "@headlessui/react";
import { initForm } from "./attributes";
import {
  getDistricts,
  getProvinces,
  getRegencies,
  getVillages,
} from "../../utils/lokasi/lokasi";
import { AxiosRequestConfig } from "axios";
import Swal from "sweetalert2";

const ManagementClient: FC = () => {
  const { token, permission } = useLoaderData<LoaderT>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<ProvinceT[]>([]);
  const [regencies, setRegencies] = useState<RegencieT[]>([]);
  const [districts, setDistricts] = useState<DistrictT[]>([]);
  const [villages, setVillages] = useState<VillageT[]>([]);
  const [dataToSend, setDataToSend] = useState<CreateClientPropsT>(initForm());
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
      getProvinces().then((res) => {
        setProvinces(res);
      });

      getAllClient();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditForm = async (item: ClientT) => {
    try {
      setShowModal(true);
      setIsEdit(true);
      const regencies = await getRegencies(item.provinsi_id);
      setRegencies(regencies);
      const districts = await getDistricts(item.kabupaten_id);
      setDistricts(districts);
      const villages = await getVillages(item.kecamatan_id);
      setVillages(villages);

      setDataToSend({
        ...dataToSend,
        id: item.id,
        nama_client: item.nama_client,
        notelp: item.notelp,
        email: item.email,
        website: item.website ?? "",
        alamat: item.alamat,
        koordinat1: item.koordinat1,
        koordinat2: item.koordinat2,
        provinsi_id: item.provinsi_id.toString(),
        kabupaten_id: item.kabupaten_id.toString(),
        kecamatan_id: item.kecamatan_id.toString(),
        kelurahan_id: item.kelurahan_id.toString(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      if (isEdit) {
        const response = await api.put(
          `/management/update-client/${dataToSend.id}`,
          dataToSend,
          requestConfig
        );

        console.log(response);
        Swal.fire({
          timer: 1000,
          showConfirmButton: false,
          position: "top-right",
          toast: true,
          icon: "success",
          title: "Berhasil",
          text: "Berhasil mengubah data",
        });
      } else {
        const response = await api.post<ResponseT<ClientT>>(
          "/management/create-client",
          dataToSend,
          requestConfig
        );

        if (data) {
          setData({ ...data, data: [...data.data, response.data.data] });
        }

        Swal.fire({
          timer: 1000,
          showConfirmButton: false,
          position: "top-right",
          toast: true,
          icon: "success",
          title: "Berhasil",
          text: "Berhasil menambahkan data",
        });
        console.log(response);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        timer: 1000,
        showConfirmButton: false,
        position: "top-right",
        toast: true,
        icon: "error",
        title: "Gagal",
        text: "Terjadi error",
      });
    } finally {
      setDataToSend(initForm());
      setShowModal(false);
      setIsEdit(false);
    }
  };

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
      <div className="card p-4 shadow-2xl">
        <div className="grid-cols-1 w-full">
          <div className="flex justify-end mb-4">
            {permission.can_create && (
              <button
                type="button"
                className="btn primary flex justify-center items-center"
                onClick={() => {
                  setShowModal(true);
                  setIsEdit(false);
                  setDataToSend(initForm());
                }}
              >
                <span className="ti-plus text-xs mr-1.5"></span>
                <span>Tambah</span>
              </button>
            )}
          </div>

          <div className="w-full overflow-auto">
            <table className="table">
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
                      <td>{index + 1}</td>
                      <td>{item.nama_client}</td>
                      <td>{item.alamat}</td>
                      <td>{item.connect_bpjs}</td>
                      <td>
                        <div className="flex gap-2 w-full items-center justify-center">
                          <button type="button" className="btn primary">
                            Details
                          </button>
                          <button
                            type="button"
                            className="btn primary"
                            onClick={() => handleEditForm(item)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn primary"
                            onClick={() => handleDelete(item.id)}
                          >
                            Hapus
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

          {/* <div>
            1
          </div> */}
        </div>
      </div>
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 overflow-auto">
          <div className="w-full max-w-2xl bg-white rounded-lg p-6 shadow-lg">
            <DialogTitle
              as="span"
              className="text-xl font-semibold mb-4 block text-center text-gray-800"
            >
              {isEdit ? "✏️ Edit Client" : "✨ Tambah Client✨"}
            </DialogTitle>

            {/* Divider (Garis Pemisah) */}
            <div className="w-full border-b-2 border-gray-300 mb-6"></div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col mb-2">
                  <label htmlFor="nama-client">Nama Client</label>
                  <input
                    type="text"
                    id="nama-client"
                    className="border border-blue-200 rounded-sm p-1 outline-none"
                    value={dataToSend.nama_client}
                    onChange={(e) =>
                      setDataToSend({
                        ...dataToSend,
                        nama_client: e.currentTarget.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col mb-2">
                  <label htmlFor="notelp">No Telp</label>
                  <input
                    type="text"
                    id="notelp"
                    className="border border-blue-200 rounded-sm p-1 outline-none"
                    value={dataToSend.notelp}
                    onChange={(e) =>
                      setDataToSend({
                        ...dataToSend,
                        notelp: e.currentTarget.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col mb-2">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    id="email"
                    className="border border-blue-200 rounded-sm p-1 outline-none"
                    value={dataToSend.email}
                    onChange={(e) =>
                      setDataToSend({
                        ...dataToSend,
                        email: e.currentTarget.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col mb-2">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    className="border border-blue-200 rounded-sm p-1 outline-none"
                    value={dataToSend.website}
                    onChange={(e) =>
                      setDataToSend({
                        ...dataToSend,
                        website: e.currentTarget.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col mb-2">
                  <label htmlFor="alamat">Alamat</label>
                  <input
                    type="text"
                    id="alamat"
                    className="border border-blue-200 rounded-sm p-1 outline-none"
                    value={dataToSend.alamat}
                    onChange={(e) =>
                      setDataToSend({
                        ...dataToSend,
                        alamat: e.currentTarget.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col mb-2">
                  <label htmlFor="provinsi_id">Provinsi</label>
                  <select
                    id="provinsi_id"
                    className="border border-blue-200 rounded-sm p-1 outline-none"
                    value={dataToSend.provinsi_id}
                    onChange={(e) => {
                      const id = e.currentTarget.value;
                      setDataToSend({ ...dataToSend, provinsi_id: id });
                      getRegencies(Number(id)).then((res) => setRegencies(res));
                    }}
                  >
                    <option value="">Pilih</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col mb-2">
                  <label htmlFor="kabupaten_id">Kab/Kota</label>
                  <select
                    id="kabupaten_id"
                    className="border border-blue-200 rounded-sm p-1 outline-none"
                    value={dataToSend.kabupaten_id}
                    onChange={(e) => {
                      const id = e.currentTarget.value;
                      setDataToSend({ ...dataToSend, kabupaten_id: id });
                      getDistricts(Number(id)).then((res) => setDistricts(res));
                    }}
                  >
                    <option value="">Pilih</option>
                    {regencies.map((regency) => (
                      <option key={regency.id} value={regency.id}>
                        {regency.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col mb-2">
                  <label htmlFor="kecamatan_id">Kecamatan</label>
                  <select
                    id="kecamatan_id"
                    className="border border-blue-200 rounded-sm p-1 outline-none"
                    value={dataToSend.kecamatan_id}
                    onChange={(e) => {
                      const id = e.currentTarget.value;
                      setDataToSend({ ...dataToSend, kecamatan_id: id });
                      getVillages(Number(id)).then((res) => setVillages(res));
                    }}
                  >
                    <option value="">Pilih</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col mb-2">
                  <label htmlFor="kelurahan_id">Kelurahan</label>
                  <select
                    id="kelurahan_id"
                    className="border border-blue-200 rounded-sm p-1 outline-none"
                    value={dataToSend.kelurahan_id}
                    onChange={(e) =>
                      setDataToSend({
                        ...dataToSend,
                        kelurahan_id: e.currentTarget.value,
                      })
                    }
                  >
                    <option value="">Pilih</option>
                    {villages.map((village) => (
                      <option key={village.id} value={village.id}>
                        {village.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col mb-2">
                  <label htmlFor="koordinat1">Koordinat 1</label>
                  <input
                    type="text"
                    id="koordinat1"
                    className="border border-blue-200 rounded-sm p-1 outline-none"
                    value={dataToSend.koordinat1}
                    onChange={(e) =>
                      setDataToSend({
                        ...dataToSend,
                        koordinat1: e.currentTarget.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col mb-2">
                  <label htmlFor="koordinat2">Koordinat 2</label>
                  <input
                    type="text"
                    id="koordinat2"
                    className="border border-blue-200 rounded-sm p-1 outline-none"
                    value={dataToSend.koordinat2}
                    onChange={(e) =>
                      setDataToSend({
                        ...dataToSend,
                        koordinat2: e.currentTarget.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end items-center">
                <button type="submit" className="btn primary">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ManagementClient;

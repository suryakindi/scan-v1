import { FC, useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useLoaderData, useParams } from "react-router";
import { AxiosRequestConfig } from "axios";

const Details: FC = () => {
  const param = useParams();
  const { token } = useLoaderData<LoaderT>();
  const requestConfig: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const [client, setClient] = useState<ClientT | null>(null);

  const getClientById = async (id: string | number) => {
    try {
      const response = await api.get<ResponseT<ClientT>>(
        `/management/get-client/id/${id}`,
        requestConfig
      );

      if (response.data.data) {
        setClient(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (param.id) {
      return () => {
        getClientById(param.id ?? "");
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="grid grid-cols-[4fr_1fr] gap-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="card flex flex-row">
            <div className="max-w-28 mr-6">
              <img src="/images/logo_t.png" alt="logo..." />
            </div>
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">kode</span>
                <span className="font-medium">kode</span>
              </div>
              <p className="text-base">deskripsi</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="card flex flex-col">
              <span className="text-lg font-medium">Dokter</span>
              <span className="text-5xl">6</span>
            </div>

            <div className="card flex flex-col">
              <span className="text-lg font-medium">SDMK/SatuSehat</span>
              <span className="text-5xl">6</span>
            </div>

            <div className="card flex flex-col">
              <span className="text-lg font-medium">Klinik</span>
              <span className="text-5xl">6</span>
            </div>
          </div>

          <div className="card">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col mb-2">
                <label htmlFor="nama-client">Nama Client</label>
                <input
                  type="text"
                  id="nama-client"
                  className="form-control"
                  disabled
                  value={client?.nama_client}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col mb-2">
                <label htmlFor="notelp">No Telp</label>
                <input
                  type="text"
                  id="notelp"
                  className="form-control"
                  disabled
                  value={client?.notelp}
                />
              </div>

              <div className="flex flex-col mb-2">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  className="form-control"
                  disabled
                  value={client?.email}
                />
              </div>

              <div className="flex flex-col mb-2">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  className="form-control"
                  disabled
                  value={client?.website ?? ""}
                />
              </div>

              <div className="flex flex-col mb-2">
                <label htmlFor="alamat">Alamat</label>
                <input
                  type="text"
                  id="alamat"
                  className="form-control"
                  disabled
                  value={client?.alamat}
                />
              </div>

              <div className="flex flex-col mb-2">
                <label htmlFor="provinsi_id">Provinsi</label>
                <input
                  type="text"
                  id="provinsi_id"
                  className="form-control"
                  disabled
                  value={client?.provinsi_id}
                />
              </div>

              <div className="flex flex-col mb-2">
                <label htmlFor="kabupaten_id">Kab/Kota</label>
                <input
                  type="text"
                  id="kabupaten_id"
                  className="form-control"
                  disabled
                  value={client?.kabupaten_id}
                />
              </div>

              <div className="flex flex-col mb-2">
                <label htmlFor="kecamatan_id">Kecamatan</label>
                <input
                  type="text"
                  id="kecamatan_id"
                  className="form-control"
                  disabled
                  value={client?.kecamatan_id}
                />
              </div>

              <div className="flex flex-col mb-2">
                <label htmlFor="kelurahan_id">Kelurahan</label>
                <input
                  type="text"
                  id="kelurahan_id"
                  className="form-control"
                  disabled
                  value={client?.kelurahan_id}
                />
              </div>

              <div className="flex flex-col mb-2">
                <label htmlFor="koordinat1">Koordinat 1</label>
                <input
                  type="text"
                  id="koordinat1"
                  className="form-control"
                  disabled
                  value={client?.koordinat1}
                />
              </div>
              <div className="flex flex-col mb-2">
                <label htmlFor="koordinat2">Koordinat 2</label>
                <input
                  type="text"
                  id="koordinat2"
                  className="form-control"
                  disabled
                  value={client?.koordinat2}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1">
          <div>
            <div className="card flex flex-col">
              <div className="flex flex-col mb-3">
                <span className="font-medium">Current plan</span>
                <span className="text-gray-400 text-sm">31 Desember 2025</span>
              </div>
              <div className="flex flex-col mb-3">
                <span className="text-sm">16 Users</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm">Estimasi tagihan bulan ini</span>
                <button type="button" className="btn btn-primary">
                  Rp. 546.600
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;

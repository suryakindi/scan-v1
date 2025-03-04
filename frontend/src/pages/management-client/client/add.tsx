import { FC, FormEventHandler, useEffect } from "react";
import { useXState } from "../../../utils/api";
import { useLokasi } from "../../../utils/lokasi";
import Swal from "sweetalert2";
import type { CreateClientPayload, CreateClientResponse } from "./types";
import { useNavigate } from "react-router";

const ClientAdd: FC = () => {
  const navigate = useNavigate();

  const [clientForm, setClientForm, clientFn] = useXState<
    CreateClientPayload,
    CreateClientResponse
  >(
    {
      nama_client: "",
      notelp: "",
      email: "",
      website: "",
      alamat: "",
      kelurahan_id: "",
      kecamatan_id: "",
      kabupaten_id: "",
      provinsi_id: "",
      koordinat1: "",
      koordinat2: "",
    },
    {
      method: "POST",
      url: "/management/create-client",
    }
  );

  const [
    { provinces, regencies, districts, villages },
    { getProvinces, getRegencies, getDistricts, getVillages },
  ] = useLokasi();

  const handleSaveClientSubmit: FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    try {
      const {
        data: { id },
      } = await clientFn.submit();

      Swal.fire({
        timer: 1000,
        showConfirmButton: false,
        position: "top-right",
        toast: true,
        icon: "success",
        title: "Berhasil",
        text: "Berhasil mengubah data",
      });

      clientFn.reset();

      navigate(`/management-client/details/${id}`, { replace: true });
    } catch {
      Swal.fire({
        timer: 1000,
        showConfirmButton: false,
        position: "top-right",
        toast: true,
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan",
      });
    }
  };

  useEffect(() => {
    return () => {
      getProvinces();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form autoComplete="off" onSubmit={handleSaveClientSubmit}>
      <div className="bg-white shadow-lg p-6 rounded-md mb-6 grid gap-4 auto-rows-min">
        <div className="grid grid-cols-1 auto-rows-min">
          <div className="flex flex-col">
            <label className="mb-1" htmlFor="nama-client">
              Nama Client
            </label>
            <input
              type="text"
              id="nama-client"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
              value={clientForm.nama_client}
              onChange={(e) =>
                setClientForm({
                  nama_client: e.currentTarget.value,
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 auto-rows-min">
          <div className="flex flex-col">
            <label className="mb-1" htmlFor="notelp">
              No Telp
            </label>
            <input
              type="text"
              id="notelp"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
              value={clientForm.notelp}
              onChange={(e) => setClientForm({ notelp: e.currentTarget.value })}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
              value={clientForm.email}
              onChange={(e) => setClientForm({ email: e.currentTarget.value })}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="website">
              Website
            </label>
            <input
              type="text"
              id="website"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
              value={clientForm.website}
              onChange={(e) =>
                setClientForm({ website: e.currentTarget.value })
              }
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="alamat">
              Alamat
            </label>
            <input
              type="text"
              id="alamat"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
              value={clientForm.alamat}
              onChange={(e) => setClientForm({ alamat: e.currentTarget.value })}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="provinsi_id">
              Provinsi
            </label>
            <select
              id="provinsi_id"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
              value={clientForm.provinsi_id}
              onChange={(e) => {
                setClientForm({
                  provinsi_id: e.currentTarget.value,
                  kabupaten_id: "",
                  kecamatan_id: "",
                  kelurahan_id: "",
                });
                getRegencies(e.currentTarget.value);
              }}
            >
              <option value="">Pilih</option>
              {provinces.map((province, key) => (
                <option key={key} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="kabupaten_id">
              Kab/Kota
            </label>
            <select
              id="kabupaten_id"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
              value={clientForm.kabupaten_id}
              onChange={(e) => {
                setClientForm({
                  kabupaten_id: e.currentTarget.value,
                  kecamatan_id: "",
                  kelurahan_id: "",
                });
                getDistricts(e.currentTarget.value);
              }}
            >
              <option value="">Pilih</option>
              {![clientForm.provinsi_id].includes("") &&
                regencies.map((regency, key) => (
                  <option key={key} value={regency.id}>
                    {regency.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="kecamatan_id">
              Kecamatan
            </label>
            <select
              id="kecamatan_id"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
              value={clientForm.kecamatan_id}
              onChange={(e) => {
                setClientForm({
                  kecamatan_id: e.currentTarget.value,
                  kelurahan_id: "",
                });
                getVillages(e.currentTarget.value);
              }}
            >
              <option value="">Pilih</option>
              {![clientForm.provinsi_id, clientForm.kabupaten_id].includes(
                ""
              ) &&
                districts.map((district, key) => (
                  <option key={key} value={district.id}>
                    {district.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="kelurahan_id">
              Kelurahan
            </label>
            <select
              id="kelurahan_id"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
              value={clientForm.kelurahan_id}
              onChange={(e) =>
                setClientForm({
                  kelurahan_id: e.currentTarget.value,
                })
              }
            >
              <option value="">Pilih</option>
              {![
                clientForm.provinsi_id,
                clientForm.kabupaten_id,
                clientForm.kecamatan_id,
              ].includes("") &&
                villages.map((village, key) => (
                  <option key={key} value={village.id}>
                    {village.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="koordinat1">
              Koordinat 1
            </label>
            <input
              type="text"
              id="koordinat1"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
              value={clientForm.koordinat1}
              onChange={(e) =>
                setClientForm({ koordinat1: e.currentTarget.value })
              }
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1" htmlFor="koordinat2">
              Koordinat 2
            </label>
            <input
              type="text"
              id="koordinat2"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
              value={clientForm.koordinat2}
              onChange={(e) =>
                setClientForm({ koordinat2: e.currentTarget.value })
              }
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer rounded-sm"
      >
        Simpan
      </button>
    </form>
  );
};

export default ClientAdd;

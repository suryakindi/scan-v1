import { FC, FormEventHandler, useEffect } from "react";
import { useLokasi } from "../../../utils/lokasi";
import { useXState } from "../../../utils/api";
import { CreatePasienPayload } from "./types";
import {
  Agama,
  GolonganDarah,
  Pekerjaan,
  Pendidikan,
  Perkawinan,
} from "../../../utils/enums";
import { useOutletContext } from "react-router";
import { LayoutContext } from "../../../layout/types";

const Pasien: FC = () => {
  const { setIsProcess } = useOutletContext<LayoutContext>();

  const [form, setForm, formFn] = useXState<
    CreatePasienPayload,
    Record<string, string>
  >(
    {
      is_active: true,
      nama: "",
      no_bpjs: "",
      nik: "",
      tempatlahir: "",
      tanggal_lahir: "",
      agama: "" as Agama,
      pendidikan_terakhir: "" as Pendidikan,
      pekerjaan: "" as Pekerjaan,
      notelp: "",
      nama_bapak: "",
      nama_ibu: "",
      status_perkawinan: "" as Perkawinan,
      nama_pasangan: "",
      golongan_darah: "" as GolonganDarah,
      cdfix: "1",
      alamat: {
        alamat: "",
        rt: "",
        rw: "",
        id_kelurahan: "",
        id_kecamatan: "",
        id_kabupaten: "",
        id_provinsi: "",
        cdfix: "1",
      },
    },
    { url: "/pasien/register-pasien", method: "POST" }
  );

  const [
    { provinces, regencies, districts, villages },
    { getProvinces, getRegencies, getDistricts, getVillages },
  ] = useLokasi();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      formFn.submit();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {
      getProvinces();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow-lg p-6 rounded-md grid gap-4 auto-rows-min">
          <div className="flex flex-col">
            <label className="mb-1" htmlFor="no-medical-record">
              No Medical Record
            </label>
            <input
              type="text"
              id="no-medical-record"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
            />
          </div>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-md grid gap-4 auto-rows-min">
          <div className="flex flex-col">
            <label className="mb-1" htmlFor="no-bpjs">
              No BPJS
            </label>
            <input
              type="text"
              id="no-bpjs"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg p-6 rounded-md grid grid-cols-2 gap-4 auto-rows-min">
        <div className="flex flex-col">
          <label className="mb-1" htmlFor="nama-lengkap">
            Nama Lengkap
          </label>
          <input
            type="text"
            id="nama-lengkap"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
            value={form.nama}
            onChange={(e) => setForm({ nama: e.currentTarget.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="nik">
            NIK
          </label>
          <input
            type="text"
            id="nik"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
            value={form.nik}
            onChange={(e) => setForm({ nik: e.currentTarget.value })}
          />
        </div>

        {/* <div className="flex flex-col">
          <label className="mb-1" htmlFor="jenis-kelamin">
            jenis-kelamin
          </label>
          <input
            type="text"
            id="jenis-kelamin"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="rm-rsud">
            rm-rsud
          </label>
          <input
            type="text"
            id="rm-rsud"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
          />
        </div> */}

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="tempat-lahir">
            Tempat Lahir
          </label>
          <input
            type="text"
            id="tempat-lahir"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
            value={form.tempatlahir}
            onChange={(e) => setForm({ tempatlahir: e.currentTarget.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="tanggal-lahir">
            Tanggal Lahir
          </label>
          <input
            type="date"
            id="tanggal-lahir"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
            value={form.tanggal_lahir}
            onChange={(e) => setForm({ tanggal_lahir: e.currentTarget.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="agama">
            Agama
          </label>
          <select
            id="agama"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
            value={form.agama}
            onChange={(e) => setForm({ agama: e.currentTarget.value as Agama })}
          >
            <option value="">Pilih</option>
            {Object.values(Agama).map((i, k) => (
              <option key={k} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="pendidikan-terakhir">
            Pendidikan Terakhir
          </label>
          <select
            id="pendidikan-terakhir"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
            value={form.pendidikan_terakhir}
            onChange={(e) =>
              setForm({
                pendidikan_terakhir: e.currentTarget.value as Pendidikan,
              })
            }
          >
            <option value="">Pilih</option>
            {Object.values(Pendidikan).map((i, k) => (
              <option key={k} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="pekerjaan">
            Pekerjaan
          </label>
          <select
            id="pekerjaan"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
            value={form.pekerjaan}
            onChange={(e) =>
              setForm({
                pekerjaan: e.currentTarget.value as Pekerjaan,
              })
            }
          >
            <option value="">Pilih</option>
            {Object.values(Pekerjaan).map((i, k) => (
              <option key={k} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="notelp">
            No Telp
          </label>
          <input
            type="text"
            id="notelp"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
            value={form.notelp}
            onChange={(e) => setForm({ notelp: e.currentTarget.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="nama-bapak">
            Nama Bapak
          </label>
          <input
            type="text"
            id="nama-bapak"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
            value={form.nama_bapak}
            onChange={(e) => setForm({ nama_bapak: e.currentTarget.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="nama-ibu">
            Nama Ibu
          </label>
          <input
            type="text"
            id="nama-ibu"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
            value={form.nama_ibu}
            onChange={(e) => setForm({ nama_ibu: e.currentTarget.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="status-perkawinan">
            Status Perkawinan
          </label>
          <select
            id="status-perkawinan"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
            value={form.status_perkawinan}
            onChange={(e) =>
              setForm({
                status_perkawinan: e.currentTarget.value as Perkawinan,
              })
            }
          >
            <option value="">Pilih</option>
            {Object.values(Perkawinan).map((i, k) => (
              <option key={k} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="nama-pasangan">
            Nama Pasangan
          </label>
          <input
            type="text"
            id="nama-pasangan"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
            value={form.nama_pasangan}
            onChange={(e) => setForm({ nama_pasangan: e.currentTarget.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="gol-darah">
            Golongan Darah
          </label>
          <select
            id="gol-darah"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
            value={form.golongan_darah}
            onChange={(e) =>
              setForm({
                golongan_darah: e.currentTarget.value as GolonganDarah,
              })
            }
          >
            <option value="">Pilih</option>
            {Object.values(GolonganDarah).map((i, k) => (
              <option key={k} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white shadow-lg p-6 rounded-md grid grid-cols-1 gap-4 auto-rows-min">
        <div className="grid grid-cols-[3fr_1fr] gap-4">
          <div className="flex flex-col">
            <label className="mb-1" htmlFor="alamat-ktp">
              Alamat KTP
            </label>
            <input
              type="text"
              id="alamat-ktp"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
            />
          </div>

          <div className="flex flex-col">
            <span className="mb-1">RT/RW</span>
            <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden">
              <input
                type="text"
                className="py-1.5 px-2 outline-none border-none flex-1"
              />
              <hr className="h-5 border-l border-gray-300" />
              <input
                type="text"
                className="py-1.5 px-2 outline-none border-none flex-1"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="mb-1" htmlFor="provinsi">
              Provinsi
            </label>
            <select
              id="provinsi"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
              value={form.alamat.id_provinsi}
              onChange={async (e) => {
                setIsProcess(true);
                setForm({
                  alamat: {
                    ...form.alamat,
                    id_provinsi: e.currentTarget.value,
                    id_kabupaten: "",
                    id_kecamatan: "",
                    id_kelurahan: "",
                  },
                });
                await getRegencies(e.currentTarget.value);
                setIsProcess(false);
              }}
            >
              <option value="">Pilih</option>
              {provinces.map((i, k) => (
                <option key={k} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="kabupaten-kota">
              Kabupaten/Kota
            </label>
            <select
              id="kabupaten-kota"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
              value={form.alamat.id_kabupaten}
              onChange={async (e) => {
                setIsProcess(true);
                setForm({
                  alamat: {
                    ...form.alamat,
                    id_kabupaten: e.currentTarget.value,
                    id_kecamatan: "",
                    id_kelurahan: "",
                  },
                });
                await getDistricts(e.currentTarget.value);
                setIsProcess(false);
              }}
            >
              <option value="">Pilih</option>
              {![form.alamat.id_provinsi].includes("") &&
                regencies.map((i, k) => (
                  <option key={k} value={i.id}>
                    {i.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="kecamatan">
              Kecamatan
            </label>
            <select
              id="kecamatan"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
              value={form.alamat.id_kecamatan}
              onChange={async (e) => {
                setIsProcess(true);
                setForm({
                  alamat: {
                    ...form.alamat,
                    id_kecamatan: e.currentTarget.value,
                    id_kelurahan: "",
                  },
                });
                await getVillages(e.currentTarget.value);
                setIsProcess(false);
              }}
            >
              <option value="">Pilih</option>
              {![form.alamat.id_provinsi, form.alamat.id_kabupaten].includes(
                ""
              ) &&
                districts.map((i, k) => (
                  <option key={k} value={i.id}>
                    {i.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="kelurahan">
              Kelurahan
            </label>
            <select
              id="kelurahan"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
              value={form.alamat.id_kelurahan}
              onChange={(e) =>
                setForm({
                  alamat: {
                    ...form.alamat,
                    id_kelurahan: e.currentTarget.value,
                  },
                })
              }
            >
              <option value="">Pilih</option>
              {![
                form.alamat.id_provinsi,
                form.alamat.id_kabupaten,
                form.alamat.id_kecamatan,
              ].includes("") &&
                villages.map((i, k) => (
                  <option key={k} value={i.id}>
                    {i.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer rounded-sm"
        >
          Simpan
        </button>
      </div>
    </form>
  );
};

export default Pasien;

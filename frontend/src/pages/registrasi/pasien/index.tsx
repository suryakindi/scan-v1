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
import { useLoaderData, useOutletContext } from "react-router";
import { LayoutContext } from "../../../layout/types";
import Select from "react-select";
import {
  cast,
  findValue,
  mapOptions,
  styles,
} from "../../../utils/react-select";
import clsx from "clsx";
import { Toast } from "../../../utils/alert";
import { LoaderT } from "../../../user";

const Pasien: FC = () => {
  const { setIsProcess } = useOutletContext<LayoutContext>();
  const { user } = useLoaderData<LoaderT>();

  const [form, setForm, formFn] = useXState<
    CreatePasienPayload,
    Record<string, string>
  >(
    {
      norm: "is_auto",
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
      cdfix: String(user.cdfix),
      alamat: {
        alamat: "",
        rt: "",
        rw: "",
        id_kelurahan: "",
        id_kecamatan: "",
        id_kabupaten: "",
        id_provinsi: "",
        cdfix: String(user.cdfix),
      },
    },
    { url: "/pasien/register-pasien", method: "POST" }
  );

  const agama = Object.values(Agama).map((i) => ({ value: i, label: i }));
  const pendidikan = Object.values(Pendidikan).map((i) => ({
    value: i,
    label: i,
  }));
  const pekerjaan = Object.values(Pekerjaan).map((i) => ({
    value: i,
    label: i,
  }));
  const perkawinan = Object.values(Perkawinan).map((i) => ({
    value: i,
    label: i,
  }));
  const golonganDarah = Object.values(GolonganDarah).map((i) => ({
    value: i,
    label: i,
  }));

  const [
    { provinces, regencies, districts, villages },
    { getProvinces, getRegencies, getDistricts, getVillages },
  ] = useLokasi();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await formFn.submit();
      Toast.fire({
        icon: "success",
        title: "Berhasil !",
        text: "Data pasien berhasil disimpan",
      });
      formFn.reset();
    } catch (error) {
      console.error(error);
      Toast.fire({
        icon: "error",
        title: "Gagal !",
        text: "Terjadi kesalahan saat menyimpan data pasien",
      });
    }
  };

  useEffect(() => {
    getProvinces();
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
            <div className="flex items-center gap-4">
              <input
                type="text"
                id="no-medical-record"
                className={clsx(
                  "border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300 flex-1",
                  "disabled:bg-gray-200/80 disabled:active:border-gray-300 disabled:focus:border-gray-300"
                )}
                disabled={form.norm === "is_auto"}
                value={form.norm === "is_auto" ? "" : form.norm}
                onChange={(e) => setForm({ norm: e.currentTarget.value })}
              />
              <button
                type="button"
                className={clsx(
                  "px-4 py-2 cursor-pointer rounded-sm",
                  form.norm === "is_auto"
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-gray-300 hover:bg-gray-300/80 text-gray-800"
                )}
                onClick={() =>
                  setForm({ norm: form.norm === "is_auto" ? "" : "is_auto" })
                }
              >
                Auto
              </button>
            </div>
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
              value={form.no_bpjs}
              onChange={(e) => setForm({ no_bpjs: e.currentTarget.value })}
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
            required={true}
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
            required={true}
          />
        </div>

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
            required={true}
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
            required={true}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="agama">
            Agama
          </label>
          <Select
            inputId="agama"
            className="w-full"
            isClearable={true}
            isSearchable={true}
            styles={styles}
            placeholder="Pilih..."
            menuPlacement="bottom"
            required={true}
            options={agama}
            value={findValue(agama, { value: form.agama }, { label: "value" })}
            onChange={(e) =>
              cast<{ value: Agama; label: string }>(e, ({ value }) => {
                setForm({ agama: value });
              })
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="pendidikan-terakhir">
            Pendidikan Terakhir
          </label>
          <Select
            inputId="pendidikan-terakhir"
            className="w-full"
            isClearable={true}
            isSearchable={true}
            styles={styles}
            placeholder="Pilih..."
            menuPlacement="bottom"
            required={true}
            options={pendidikan}
            value={findValue(
              pendidikan,
              { value: form.pendidikan_terakhir },
              { label: "value" }
            )}
            onChange={(e) =>
              cast<{ value: Pendidikan; label: string }>(e, ({ value }) => {
                setForm({ pendidikan_terakhir: value });
              })
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="pekerjaan">
            Pekerjaan
          </label>
          <Select
            inputId="pekerjaan"
            className="w-full"
            isClearable={true}
            isSearchable={true}
            styles={styles}
            placeholder="Pilih..."
            menuPlacement="bottom"
            required={true}
            options={pekerjaan}
            value={findValue(
              pekerjaan,
              { value: form.pekerjaan },
              { label: "value" }
            )}
            onChange={(e) =>
              cast<{ value: Pekerjaan; label: string }>(e, ({ value }) => {
                setForm({ pekerjaan: value });
              })
            }
          />
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
            required={false}
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
            required={true}
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
            required={true}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="status-perkawinan">
            Status Perkawinan
          </label>
          <Select
            inputId="status-perkawinan"
            className="w-full"
            isClearable={true}
            isSearchable={true}
            styles={styles}
            placeholder="Pilih..."
            menuPlacement="bottom"
            required={true}
            options={perkawinan}
            value={findValue(
              perkawinan,
              { value: form.status_perkawinan },
              { label: "value" }
            )}
            onChange={(e) =>
              cast<{ value: Perkawinan; label: string }>(e, ({ value }) => {
                setForm({ status_perkawinan: value });
              })
            }
          />
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
            required={false}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1" htmlFor="gol-darah">
            Golongan Darah
          </label>
          <Select
            inputId="gol-darah"
            className="w-full"
            isClearable={true}
            isSearchable={true}
            styles={styles}
            placeholder="Pilih..."
            menuPlacement="bottom"
            required={true}
            options={golonganDarah}
            value={findValue(
              golonganDarah,
              { value: form.golongan_darah },
              { label: "value" }
            )}
            onChange={(e) =>
              cast<{ value: GolonganDarah; label: string }>(e, ({ value }) => {
                setForm({ golongan_darah: value });
              })
            }
          />
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
              required={true}
              value={form.alamat.alamat}
              onChange={(e) =>
                setForm({
                  alamat: { ...form.alamat, alamat: e.currentTarget.value },
                })
              }
            />
          </div>

          <div className="flex flex-col">
            <span className="mb-1">RT/RW</span>
            <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden">
              <input
                type="text"
                className="py-1.5 px-2 outline-none border-none flex-1"
                required={true}
                value={form.alamat.rt}
                onChange={(e) =>
                  setForm({
                    alamat: { ...form.alamat, rt: e.currentTarget.value },
                  })
                }
              />
              <hr className="h-5 border-l border-gray-300" />
              <input
                type="text"
                className="py-1.5 px-2 outline-none border-none flex-1"
                required={true}
                value={form.alamat.rw}
                onChange={(e) =>
                  setForm({
                    alamat: { ...form.alamat, rw: e.currentTarget.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="mb-1" htmlFor="provinsi">
              Provinsi
            </label>
            <Select
              inputId="provinsi"
              className="w-full"
              isClearable={true}
              isSearchable={true}
              styles={styles}
              placeholder="Pilih..."
              menuPlacement="top"
              required={true}
              options={mapOptions(provinces, { l: "name", v: "id" })}
              value={findValue(
                provinces,
                {
                  id: Number(form.alamat.id_provinsi),
                },
                { label: "name", value: "id" }
              )}
              onChange={(e) =>
                cast<{ label: string; value: number }>(e, async ({ value }) => {
                  setIsProcess(true);
                  setForm({
                    alamat: {
                      ...form.alamat,
                      id_provinsi: String(value),
                      id_kabupaten: "",
                      id_kecamatan: "",
                      id_kelurahan: "",
                    },
                  });
                  await getRegencies(value);
                  setIsProcess(false);
                })
              }
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="kabupaten-kota">
              Kabupaten/Kota
            </label>
            <Select
              inputId="kabupaten-kota"
              className="w-full"
              isClearable={true}
              isSearchable={true}
              styles={styles}
              placeholder="Pilih..."
              menuPlacement="top"
              required={true}
              options={
                [form.alamat.id_provinsi].includes("")
                  ? []
                  : mapOptions(regencies, { l: "name", v: "id" })
              }
              value={findValue(
                regencies,
                {
                  id: Number(form.alamat.id_kabupaten),
                },
                { label: "name", value: "id" }
              )}
              onChange={(e) =>
                cast<{ label: string; value: number }>(e, async ({ value }) => {
                  setIsProcess(true);
                  setForm({
                    alamat: {
                      ...form.alamat,
                      id_kabupaten: String(value),
                      id_kecamatan: "",
                      id_kelurahan: "",
                    },
                  });
                  await getDistricts(value);
                  setIsProcess(false);
                })
              }
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="kecamatan">
              Kecamatan
            </label>
            <Select
              inputId="kecamatan"
              className="w-full"
              isClearable={true}
              isSearchable={true}
              styles={styles}
              placeholder="Pilih..."
              menuPlacement="top"
              required={true}
              options={
                [form.alamat.id_provinsi, form.alamat.id_kabupaten].includes("")
                  ? []
                  : mapOptions(districts, { l: "name", v: "id" })
              }
              value={findValue(
                districts,
                {
                  id: Number(form.alamat.id_kecamatan),
                },
                { label: "name", value: "id" }
              )}
              onChange={(e) =>
                cast<{ label: string; value: number }>(e, async ({ value }) => {
                  setIsProcess(true);
                  setForm({
                    alamat: {
                      ...form.alamat,
                      id_kecamatan: String(value),
                      id_kelurahan: "",
                    },
                  });
                  await getVillages(value);
                  setIsProcess(false);
                })
              }
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="kelurahan">
              Kelurahan
            </label>
            <Select
              inputId="kelurahan"
              className="w-full"
              isClearable={true}
              isSearchable={true}
              styles={styles}
              placeholder="Pilih..."
              menuPlacement="top"
              required={true}
              options={
                [
                  form.alamat.id_provinsi,
                  form.alamat.id_kabupaten,
                  form.alamat.id_kecamatan,
                ].includes("")
                  ? []
                  : mapOptions(villages, { l: "name", v: "id" })
              }
              value={findValue(
                villages,
                {
                  id: Number(form.alamat.id_kelurahan),
                },
                { label: "name", value: "id" }
              )}
              onChange={(e) =>
                cast<{ label: string; value: number }>(e, ({ value }) => {
                  setForm({
                    alamat: {
                      ...form.alamat,
                      id_kelurahan: String(value),
                    },
                  });
                })
              }
            />
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

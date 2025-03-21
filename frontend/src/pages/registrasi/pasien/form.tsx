import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { FC, FormEventHandler, useEffect, useState } from "react";
import Select from "react-select";
import {
  cast,
  findValue,
  mapOptions,
  styles,
} from "../../../utils/react-select";
import clsx from "clsx";
import { Link, useLoaderData, useOutletContext, useParams } from "react-router";
import { JaminanT, JenisKunjunganT, PasienT, RuanganT } from "./types";
import { LoaderT } from "../../../user";
import { api, ResponseT, useXState } from "../../../utils/api";
import { paginateInit, PaginateT } from "../../../utils/paginate";
import { Toast } from "../../../utils/alert";
import { LayoutContext } from "../../../layout/types";

const FormPasien: FC = () => {
  const param = useParams();
  const { setIsProcess } = useOutletContext<LayoutContext>();
  const { user } = useLoaderData<LoaderT>();
  const [isBPJSAvailable, setIsBPJSAvailable] = useState<boolean>(false);
  const [form, setForm, formFn] = useXState<_Payload, _Response>(
    {
      id_pasien: Number(param.id),
      id_ruangan_asal: null,
      id_jenis_kunjungan: null,
      id_jaminan: null,
      tanggal_registrasi: "",
      is_active: true,
      cdfix: user.cdfix,
    },
    { method: "POST", url: "/registrasi-pelayanan/create-registrasi-pelayanan" }
  );

  const [pasien, setPasien] = useState<PasienT | null>(null);

  const getPasienById = async () => {
    try {
      const response = await api.get<ResponseT<PasienT>>(
        `/pasien/get-pasien-id/${param.id}`
      );
      if (response.data.data) {
        setPasien(response.data.data);
        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  };

  type _Payload = {
    id_pasien: number | null;
    id_ruangan_asal: number | null;
    id_jenis_kunjungan: number | null;
    id_jaminan: number | null;
    tanggal_registrasi: string;
    is_active: boolean;
    cdfix: number | string | null;
  };

  type _Response = {
    id_pasien: number;
    id_ruangan_asal: number;
    id_jenis_kunjungan: number;
    id_jaminan: number;
    tanggal_registrasi: string;
    is_active: boolean;
    cdfix: number;
    no_registrasi: string;
    id_ruangan_terakhir: number;
    created_by: number;
    updated_at: string;
    created_at: string;
    id: number;
  };

  const [ruangans, setRuangans] = useState<PaginateT<RuanganT[]>>(
    paginateInit()
  );

  const getMasterRuangan = async () => {
    try {
      const response = await api.get<ResponseT<PaginateT<RuanganT[]>>>(
        `/get-master-ruangan/${user.cdfix}`
      );

      if (response.data.data) {
        setRuangans(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [jenisKunjungans, setJenisKunjungans] = useState<
    PaginateT<JenisKunjunganT[]>
  >(paginateInit());

  const getJenisKunjungan = async () => {
    try {
      const response = await api.get("/get-master-jeniskunjungan");
      if (response.data.data) {
        setJenisKunjungans(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [jaminans, setJaminans] = useState<PaginateT<JaminanT[]>>(
    paginateInit()
  );

  const getJaminan = async () => {
    try {
      const response = await api.get<ResponseT<PaginateT<JaminanT[]>>>(
        "/get-master-jaminan"
      );
      if (response.data.data) {
        setJaminans(response.data.data);
        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getKeteranganBPJS = async (no_bpjs: number | string) => {
    try {
      type _Response = {
        original: { data: { ketAktif: "AKTIF" | string } };
      };

      const response = await api.get<ResponseT<_Response>>(
        `/registrasi-pelayanan/keterangan-aktif-bpjs/id_client/${user.cdfix}?nokartu=${no_bpjs}`
      );
      Toast.fire({
        icon: "success",
        title: "Aktif",
        text: "Status BPJS Pasien Aktif",
      });
      const isBPJSActive =
        response?.data?.data?.original?.data?.ketAktif === "AKTIF";

      setIsBPJSAvailable(isBPJSActive);

      return isBPJSActive;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await formFn.submit();

      Toast.fire({
        icon: "success",
        title: "Berhasil",
        text: "Registrasi berhasil",
      });
    } catch (error) {
      const list: unknown[] = [
        "Gagal membuat Registrasi: Pasien masih memiliki pendaftaran yang belum selesai.",
      ];

      const e = error as { response?: { data: { message: string } } };
      const message = e.response?.data.message;

      Toast.fire({
        icon: "error",
        title: "Gagal",
        text: list.includes(message) ? message : "Registrasi gagal",
      });
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {
      const load = async () => {
        setIsProcess(true);

        try {
          const _pasien = await getPasienById();
          await getMasterRuangan();
          await getJenisKunjungan();
          const _jaminans = await getJaminan();

          if (_pasien) {
            const bpjs = await getKeteranganBPJS(_pasien.no_bpjs);
            if (bpjs && _jaminans) {
              const finded = findValue(
                _jaminans.data,
                { penjamin: "JKN" },
                { id_jaminan: "id" }
              );

              setForm({ id_jaminan: Number(finded?.id_jaminan) });
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsProcess(false);
        }
      };

      load();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow-lg p-6 rounded-md flex items-center">
          <div className="flex">
            <div className="size-28 aspect-square">
              <img src="/images/userL.png" alt="user.." />
            </div>
            <div className="ml-3">
              <div className="flex flex-col mb-3">
                <span className="font-medium">{pasien?.nama}</span>
                <span>{pasien?.nik}</span>
              </div>
              {pasien &&
                (pasien.is_active ? (
                  <button
                    type="button"
                    className="flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white cursor-pointer rounded-sm"
                  >
                    Aktif
                  </button>
                ) : (
                  <button
                    type="button"
                    className="flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white cursor-pointer rounded-sm"
                  >
                    Aktif
                  </button>
                ))}
            </div>
          </div>
        </div>
        <TabGroup>
          <TabList>
            <Tab className="mr-2 cursor-pointer outline-none rounded-sm px-4 py-2 data-[selected]:text-white data-[selected]:bg-gray-600 data-[selected]:font-semibold data-[hover]:bg-gray-300">
              Poliklinik
            </Tab>
          </TabList>
          <TabPanels className="mt-4">
            {/* profile */}
            <TabPanel className="grid grid-cols-1 gap-6 auto-rows-min">
              <form
                autoComplete="off"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-6 auto-rows-min"
              >
                <div className="bg-white shadow-lg p-6 rounded-md grid grid-cols-1 gap-4 auto-rows-min">
                  <div className="flex flex-col">
                    <label className="mb-1" htmlFor="poliklinik-tanggal">
                      Tanggal
                    </label>
                    <input
                      type="datetime-local"
                      id="poliklinik-tanggal"
                      required={true}
                      className={clsx(
                        "border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300",
                        "disabled:bg-gray-200/80 disabled:active:border-gray-300 disabled:focus:border-gray-300"
                      )}
                      value={form.tanggal_registrasi}
                      onChange={(e) =>
                        setForm({ tanggal_registrasi: e.currentTarget.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1" htmlFor="poliklinik-klinik">
                      Klinik
                    </label>
                    <Select
                      inputId="poliklinik-klinik"
                      className="w-full"
                      isSearchable={true}
                      styles={styles}
                      placeholder="Pilih..."
                      menuPlacement="bottom"
                      required={true}
                      options={mapOptions(ruangans.data, {
                        l: "nama_ruangan",
                        v: "id",
                      })}
                      value={findValue(
                        ruangans.data,
                        {
                          id: Number(form.id_ruangan_asal),
                        },
                        { label: "nama_ruangan", value: "id" }
                      )}
                      onChange={(e) =>
                        cast<{ label: string; value: number }>(
                          e,
                          async ({ value }) => {
                            setIsProcess(true);
                            setForm({
                              id_ruangan_asal: value,
                            });
                            setIsProcess(false);
                          }
                        )
                      }
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      className="mb-1"
                      htmlFor="poliklinik-jenis-kunjungan"
                    >
                      Jenis Kunjungan
                    </label>
                    <Select
                      inputId="poliklinik-jenis-kunjungan"
                      className="w-full"
                      isSearchable={true}
                      styles={styles}
                      placeholder="Pilih..."
                      menuPlacement="bottom"
                      required={true}
                      options={mapOptions(jenisKunjungans.data, {
                        l: "jenis_kunjungan",
                        v: "id",
                      })}
                      value={findValue(
                        jenisKunjungans.data,
                        { id: Number(form.id_jenis_kunjungan) },
                        { label: "jenis_kunjungan", value: "id" }
                      )}
                      onChange={(e) =>
                        cast<{ label: string; value: number }>(
                          e,
                          ({ value }) => {
                            setForm({ id_jenis_kunjungan: value });
                          }
                        )
                      }
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1" htmlFor="poliklinik-jaminan">
                      Jaminan
                    </label>
                    <Select
                      inputId="poliklinik-jaminan"
                      className="w-full"
                      isSearchable={true}
                      styles={styles}
                      placeholder="Pilih..."
                      menuPlacement="bottom"
                      required={true}
                      options={mapOptions(
                        jaminans.data.filter(
                          ({ penjamin }) =>
                            isBPJSAvailable || penjamin !== "JKN"
                        ),
                        {
                          l: "penjamin",
                          v: "id",
                        }
                      )}
                      value={findValue(
                        jaminans.data,
                        { id: Number(form.id_jaminan) },
                        { label: "penjamin", value: "id" }
                      )}
                      onChange={(e) =>
                        cast<{ label: string; value: number }>(
                          e,
                          ({ value }) => {
                            setForm({ id_jaminan: value });
                          }
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white cursor-pointer rounded-sm"
                  >
                    Daftar
                  </button>
                </div>
              </form>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>

      <div className="flex justify-end">
        <Link
          to="/registrasi/list"
          className="flex items-center px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white cursor-pointer rounded-sm"
        >
          Kembali
        </Link>
      </div>
    </div>
  );
};

export default FormPasien;

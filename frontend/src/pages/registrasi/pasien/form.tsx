import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { FC, FormEventHandler, useEffect, useState } from "react";
import Select from "react-select";
import { mapOptions, styles } from "../../../utils/react-select";
import clsx from "clsx";
import { Link, useLoaderData, useOutletContext, useParams } from "react-router";
import { JaminanT, JenisKunjunganT, PasienT, RuanganT, TkpT } from "./types";
import { LoaderT } from "../../../user";
import { api, ResponseT, useXState } from "../../../utils/api";
import { PaginateT } from "../../../utils/paginate";
import { Toast } from "../../../utils/alert";
import { LayoutContext } from "../../../layout/types";

const FormPasien: FC = () => {
  const param = useParams();
  const { setIsProcess } = useOutletContext<LayoutContext>();
  const { user } = useLoaderData<LoaderT>();

  const [pasien, setPasien] = useState<PasienT | null>(null);

  const getPasienById = async () => {
    try {
      const response = await api.get<ResponseT<PasienT>>(
        `/pasien/get-pasien-id/${param.id}`
      );
      if (response.data.data) {
        setPasien(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [form, setForm, formFn] = useXState({}, {});

  const [ruangans, setRuangans] = useState<PaginateT<RuanganT[]>>({
    current_page: 1,
    data: [],
    first_page_url: "",
    from: 1,
    last_page: 1,
    last_page_url: "",
    links: [],
    next_page_url: null,
    path: "",
    per_page: 100,
    prev_page_url: null,
    to: 12,
    total: 12,
  });

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
  >({
    current_page: 1,
    data: [],
    first_page_url: "",
    from: 1,
    last_page: 1,
    last_page_url: "",
    links: [],
    next_page_url: null,
    path: "",
    per_page: 100,
    prev_page_url: null,
    to: 12,
    total: 12,
  });

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

  const [jaminans, setJaminans] = useState<PaginateT<JaminanT[]>>({
    current_page: 1,
    data: [],
    first_page_url: "",
    from: 1,
    last_page: 1,
    last_page_url: "",
    links: [],
    next_page_url: null,
    path: "",
    per_page: 100,
    prev_page_url: null,
    to: 12,
    total: 12,
  });

  const getJaminan = async () => {
    try {
      const response = await api.get<ResponseT<PaginateT<JaminanT[]>>>(
        "/get-master-jaminan"
      );
      if (response.data.data) {
        setJaminans(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [tkps, setTkps] = useState<PaginateT<TkpT[]>>({
    current_page: 1,
    data: [],
    first_page_url: "",
    from: 1,
    last_page: 1,
    last_page_url: "",
    links: [],
    next_page_url: null,
    path: "",
    per_page: 100,
    prev_page_url: null,
    to: 12,
    total: 12,
  });

  const getTkp = async () => {
    try {
      const response = await api.get<ResponseT<PaginateT<TkpT[]>>>(
        "/master-data/get-master-tkp"
      );
      if (response.data.data) {
        setTkps(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      Toast.fire({
        icon: "success",
        title: "Berhasil",
        text: "Registrasi berhasil",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Gagal",
        text: "Registrasi gagal",
      });
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {
      const load = async () => {
        setIsProcess(true);
        await getPasienById();
        await getMasterRuangan();
        await getJenisKunjungan();
        await getJaminan();
        await getTkp();
        setIsProcess(false);
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
                      type="date"
                      id="poliklinik-tanggal"
                      required={true}
                      className={clsx(
                        "border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300",
                        "disabled:bg-gray-200/80 disabled:active:border-gray-300 disabled:focus:border-gray-300"
                      )}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1" htmlFor="poliklinik-klinik">
                      Klinik
                    </label>
                    <Select
                      inputId="poliklinik-klinik"
                      className="w-full"
                      isClearable={true}
                      isSearchable={true}
                      styles={styles}
                      placeholder="Pilih..."
                      menuPlacement="bottom"
                      required={true}
                      options={mapOptions(ruangans.data, {
                        l: "nama_ruangan",
                        v: "id",
                      })}
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
                      isClearable={true}
                      isSearchable={true}
                      styles={styles}
                      placeholder="Pilih..."
                      menuPlacement="bottom"
                      required={true}
                      options={mapOptions(jenisKunjungans.data, {
                        l: "jenis_kunjungan",
                        v: "id",
                      })}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1" htmlFor="poliklinik-jaminan">
                      Jaminan
                    </label>
                    <Select
                      inputId="poliklinik-jaminan"
                      className="w-full"
                      isClearable={true}
                      isSearchable={true}
                      styles={styles}
                      placeholder="Pilih..."
                      menuPlacement="bottom"
                      required={true}
                      options={mapOptions(jaminans.data, {
                        l: "penjamin",
                        v: "id",
                      })}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1" htmlFor="poliklinik-tkp">
                      TKP
                    </label>
                    <Select
                      inputId="poliklinik-tkp"
                      className="w-full"
                      isClearable={true}
                      isSearchable={true}
                      styles={styles}
                      placeholder="Pilih..."
                      menuPlacement="bottom"
                      required={true}
                      options={mapOptions(tkps.data, {
                        l: "nama_tkp",
                        v: "id",
                      })}
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

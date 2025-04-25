import { FC, FormEventHandler, useEffect, useState } from "react";
import { Link, useLoaderData, useOutletContext, useParams } from "react-router";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import * as HeroSolid from "@heroicons/react/24/solid";
import * as HeroOutline from "@heroicons/react/24/outline";
import clsx from "clsx";
import { LoaderT, RolesT, UserT } from "../../../user";
import { useLokasi } from "../../../utils/lokasi";
import { api, ResponseT, useXState } from "../../../utils/api";
import Select from "react-select";
import type {
  BPJSPCarePayload,
  BPJSPCareTool,
  BPJSPCareToolServiceName,
  ClientT,
  SatuSehatPayload,
  SatuSehatT,
  UpdateClientPayload,
  UpdateClientResponse,
} from "./types";
import { LayoutContext } from "../../../layout/types";
import { Toast } from "../../../utils/alert";
import {
  cast,
  findValue,
  mapOptions,
  styles,
} from "../../../utils/react-select";
import { BaseURLT } from "../base-url/types";
import { AxiosRequestConfig } from "axios";

type ClientSettings = Record<
  "satuSehat" | "BPJSPCare" | "BPJSAntrol",
  { online: boolean; showKey: boolean }
>;

const Details: FC = () => {
  const param = useParams();
  const { user } = useLoaderData<LoaderT>();
  const { setIsProcess } = useOutletContext<LayoutContext>();
  const [settings, setSettings] = useState<ClientSettings>({
    satuSehat: { online: false, showKey: false },
    BPJSPCare: { online: false, showKey: false },
    BPJSAntrol: { online: false, showKey: false },
  });

  const [
    { provinces, regencies, districts, villages },
    { getProvinces, getRegencies, getDistricts, getVillages },
  ] = useLokasi();

  const getClientById = async (id: string | number): Promise<void> => {
    try {
      const response = await api.get<ResponseT<ClientT>>(
        `/management/get-client/id/${id}`
      );

      if (response.data.data) {
        await getProvinces();
        await getRegencies(response.data.data.provinsi_id);
        await getDistricts(response.data.data.kabupaten_id);
        await getVillages(response.data.data.kecamatan_id);

        setClientForm({
          nama_client: response.data.data.nama_client,
          notelp: response.data.data.notelp,
          email: response.data.data.email,
          website: response.data.data.website ?? "",
          alamat: response.data.data.alamat,
          kelurahan_id: response.data.data.kelurahan_id.toString(),
          kecamatan_id: response.data.data.kecamatan_id.toString(),
          kabupaten_id: response.data.data.kabupaten_id.toString(),
          provinsi_id: response.data.data.provinsi_id.toString(),
          koordinat1: response.data.data.koordinat1,
          koordinat2: response.data.data.koordinat2,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (param.id) {
      getClientById(param.id ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [clientForm, setClientForm, clientFn] = useXState<
    UpdateClientPayload,
    UpdateClientResponse
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
      method: "PUT",
      url: `/management/update-client/${param.id}`,
    }
  );

  const handleSaveClientSubmit: FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    try {
      setIsProcess(true);
      await clientFn.submit();
      Toast.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data berhasil disimpan",
      });
    } catch {
      Toast.fire({
        icon: "error",
        title: "Gagal",
        text: "Data gagal disimpan",
      });
    } finally {
      setIsProcess(false);
    }
  };

  const [dataUrls, setDataUrls] = useState<BaseURLT[]>([]);
  const getDataUrls = async () => {
    try {
      const response = await api.get<ResponseT<BaseURLT[]>>(
        "/integerasi-sistem/get-base-url"
      );
      if (response.data.data) {
        setDataUrls(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const ConnectionBPJSGetDokter = async () => {
    try {
      const response = await api.get(
        `/integerasi-sistem/get-dokter-bpjs/id_client/${param.id}?start=1&end=100`
      );
      if (response.data.data) {
        setSettings((prev) => ({
          ...prev,
          BPJSPCare: { ...prev.BPJSPCare, online: true },
        }));
        console.log("sukses konek bpjs");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [satuSehatConf, setSatuSehatConf] = useState<AxiosRequestConfig>({
    url: "/integerasi-sistem/create-satu-sehat",
    method: "POST",
  });

  const [satuSehatForm, setSatuSehatForm, satuSehatFormFn] =
    useXState<SatuSehatPayload>(
      {
        kode_fayankes: "",
        organization_id: "",
        client_key: "",
        secret_key: "",
        id_base_url: null as unknown as SatuSehatPayload["id_base_url"],
        cdfix: String(user.cdfix),
      },
      satuSehatConf
    );

  const getSatuSehat = async () => {
    try {
      const response = await api.get<ResponseT<SatuSehatT>>(
        `/integerasi-sistem/get-satu-sehat/${user.cdfix}`
      );
      if (response.data.data) {
        setSatuSehatForm({
          kode_fayankes: response.data.data.kode_fayankes,
          organization_id: response.data.data.organization_id,
          client_key: response.data.data.client_key,
          secret_key: response.data.data.secret_key,
          id_base_url: Number(response.data.data.id_base_url),
        });

        setSatuSehatConf({
          url: `/integerasi-sistem/edit-satu-sehat/${response.data.data.id}`,
          method: "PUT",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectionSatuSehat = async () => {
    try {
      const response = await api.get("/integerasi-sistem/check-satu-sehat");
      if (response.data.data) {
        setSettings((prev) => ({
          ...prev,
          satuSehat: { ...prev.satuSehat, online: true },
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [BPJSPCareConf, setBPJSPCareConf] = useState<AxiosRequestConfig>({
    method: "POST",
    url: `/integerasi-sistem/create-bpjs-tools/${param.id}`,
  });

  const [BPJSPCareForm, setBPJSPCareForm, BPJSPCareFormFn] =
    useXState<BPJSPCarePayload>(
      {
        id_base_url: null as unknown as BPJSPCarePayload["id_base_url"],
        cons_id: "",
        secretkey: "",
        provider_id: "",
        service_name: "pcare-rest",
        userkey: "",
        username: "",
        password: "",
      },
      BPJSPCareConf
    );

  const getBPJSPCareById = async () => {
    try {
      const response = await api.get<
        ResponseT<{
          bpjs_tools: BPJSPCareTool;
          service_name: BPJSPCareToolServiceName[];
        }>
      >(`/integerasi-sistem/get-bpjs-tools/${param.id}`);

      if (response.data.data) {
        setBPJSPCareForm({
          id_base_url: response.data.data.service_name[0]?.id_base_url,
          cons_id: response.data.data.bpjs_tools.cons_id,
          secretkey: response.data.data.bpjs_tools.secretkey,
          provider_id: response.data.data.bpjs_tools.provider_id,
          service_name: response.data.data.service_name[0]?.service_name,
          userkey: response.data.data.service_name[0]?.userkey,
          username: response.data.data.service_name[0]?.username,
          password: response.data.data.service_name[0]?.password,
        });

        setBPJSPCareConf({
          method: "PUT",
          url: `/integerasi-sistem/update-bpjs-tools/${param.id}`,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [BPJSAntrolForm, setBPJSAntrolForm] = useXState<{
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
  }>(
    {
      "1": "",
      "2": "",
      "3": "",
      "4": "",
      "5": "",
      "6": "",
    },
    {}
  );

  const [userClients, setUserClients] = useState<(UserT & { role: RolesT })[]>(
    []
  );

  const getUserClient = async () => {
    try {
      const response = await api.get<ResponseT<(UserT & { role: RolesT })[]>>(
        "/management/get-user-client"
      );

      if (response.data.data) setUserClients(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      setIsProcess(true);
      await getSatuSehat();
      await getBPJSPCareById();
      await getDataUrls();
      await ConnectionBPJSGetDokter();
      await connectionSatuSehat();
      await getUserClient();
      setIsProcess(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="grid grid-cols-[4fr_1fr] gap-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white shadow-lg p-6 rounded-md flex flex-row">
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

          <TabGroup>
            <TabList>
              <Tab className="mr-2 cursor-pointer outline-none rounded-sm px-4 py-2 data-[selected]:text-white data-[selected]:bg-gray-600 data-[selected]:font-semibold data-[hover]:bg-gray-300">
                Profile
              </Tab>
              <Tab className="mr-2 cursor-pointer outline-none rounded-sm px-4 py-2 data-[selected]:text-white data-[selected]:bg-gray-600 data-[selected]:font-semibold data-[hover]:bg-gray-300">
                User
              </Tab>
              <Tab className="mr-2 cursor-pointer outline-none rounded-sm px-4 py-2 data-[selected]:text-white data-[selected]:bg-gray-600 data-[selected]:font-semibold data-[hover]:bg-gray-300">
                Settings
              </Tab>
            </TabList>
            <TabPanels className="mt-4">
              {/* profile */}
              <TabPanel className="grid grid-cols-1 gap-6 auto-rows-min">
                <div className="grid grid-cols-3 gap-6 auto-rows-min">
                  <div className="bg-white shadow-lg p-6 rounded-md flex flex-col">
                    <span className="text-lg font-medium">Dokter</span>
                    <span className="text-5xl">6</span>
                  </div>

                  <div className="bg-white shadow-lg p-6 rounded-md flex flex-col">
                    <span className="text-lg font-medium">SDMK/SatuSehat</span>
                    <span className="text-5xl">6</span>
                  </div>

                  <div className="bg-white shadow-lg p-6 rounded-md flex flex-col">
                    <span className="text-lg font-medium">Klinik</span>
                    <span className="text-5xl">6</span>
                  </div>
                </div>

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
                          onChange={(e) =>
                            setClientForm({ notelp: e.currentTarget.value })
                          }
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
                          onChange={(e) =>
                            setClientForm({ email: e.currentTarget.value })
                          }
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
                          onChange={(e) =>
                            setClientForm({ alamat: e.currentTarget.value })
                          }
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="mb-1" htmlFor="provinsi_id">
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
                          options={mapOptions(provinces, {
                            l: "name",
                            v: "id",
                          })}
                          value={findValue(
                            provinces,
                            {
                              id: Number(clientForm.provinsi_id),
                            },
                            { label: "name", value: "id" }
                          )}
                          onChange={(e) =>
                            cast<{ label: string; value: number }>(
                              e,
                              async ({ value }) => {
                                setIsProcess(true);
                                setClientForm({
                                  provinsi_id: String(value),
                                  kabupaten_id: "",
                                  kecamatan_id: "",
                                  kelurahan_id: "",
                                });
                                await getRegencies(value);
                                setIsProcess(false);
                              }
                            )
                          }
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="mb-1" htmlFor="kabupaten_id">
                          Kab/Kota
                        </label>
                        <Select
                          inputId="kabupaten_id"
                          className="w-full"
                          isClearable={true}
                          isSearchable={true}
                          styles={styles}
                          placeholder="Pilih..."
                          menuPlacement="top"
                          required={true}
                          options={
                            [clientForm.provinsi_id].includes("")
                              ? []
                              : mapOptions(regencies, { l: "name", v: "id" })
                          }
                          value={findValue(
                            regencies,
                            {
                              id: Number(clientForm.kabupaten_id),
                            },
                            { label: "name", value: "id" }
                          )}
                          onChange={(e) =>
                            cast<{ label: string; value: number }>(
                              e,
                              async ({ value }) => {
                                setIsProcess(true);
                                setClientForm({
                                  kabupaten_id: String(value),
                                  kecamatan_id: "",
                                  kelurahan_id: "",
                                });
                                await getDistricts(value);
                                setIsProcess(false);
                              }
                            )
                          }
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="mb-1" htmlFor="kecamatan_id">
                          Kecamatan
                        </label>
                        <Select
                          inputId="kecamatan_id"
                          className="w-full"
                          isClearable={true}
                          isSearchable={true}
                          styles={styles}
                          placeholder="Pilih..."
                          menuPlacement="top"
                          required={true}
                          options={
                            [
                              clientForm.provinsi_id,
                              clientForm.kabupaten_id,
                            ].includes("")
                              ? []
                              : mapOptions(districts, { l: "name", v: "id" })
                          }
                          value={findValue(
                            districts,
                            {
                              id: Number(clientForm.kecamatan_id),
                            },
                            { label: "name", value: "id" }
                          )}
                          onChange={(e) =>
                            cast<{ label: string; value: number }>(
                              e,
                              async ({ value }) => {
                                setIsProcess(true);
                                setClientForm({
                                  kecamatan_id: String(value),
                                  kelurahan_id: "",
                                });
                                await getVillages(value);
                                setIsProcess(false);
                              }
                            )
                          }
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="mb-1" htmlFor="kelurahan_id">
                          Kelurahan
                        </label>
                        <Select
                          inputId="kelurahan_id"
                          className="w-full"
                          isClearable={true}
                          isSearchable={true}
                          styles={styles}
                          placeholder="Pilih..."
                          menuPlacement="top"
                          required={true}
                          options={
                            [
                              clientForm.provinsi_id,
                              clientForm.kabupaten_id,
                              clientForm.kecamatan_id,
                            ].includes("")
                              ? []
                              : mapOptions(villages, { l: "name", v: "id" })
                          }
                          value={findValue(
                            villages,
                            {
                              id: Number(clientForm.kelurahan_id),
                            },
                            { label: "name", value: "id" }
                          )}
                          onChange={(e) =>
                            cast<{ label: string; value: number }>(
                              e,
                              ({ value }) => {
                                setClientForm({
                                  kelurahan_id: String(value),
                                });
                              }
                            )
                          }
                        />
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
              </TabPanel>

              <TabPanel>
                <div className="bg-white shadow-lg rounded-md">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <span className="font-medium text-lg">Users</span>
                      </div>
                      <div className="flex-1 justify-end flex">
                        <input
                          type="text"
                          className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300 ml-2"
                          placeholder="Search..."
                        />
                        <Link
                          to="#"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer rounded-sm ml-2"
                          onClick={(e) => e.preventDefault()}
                        >
                          Add New
                        </Link>
                      </div>
                    </div>
                    <table className="me-table">
                      <thead>
                        <tr>
                          <th>NO</th>
                          <th>NAMA</th>
                          <th>LEVEL</th>
                          <th>STATUS USER</th>
                          <th>SATU SEHAT</th>
                          <th>KODE BPJS</th>
                          <th>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userClients.map((userClient, k) => (
                          <tr key={k}>
                            <td>{k + 1}</td>
                            <td>
                              <div className="flex items-center w-full pl-4">
                                <div className="flex w-10 h-10 bg-blue-400 text-white rounded-full items-center justify-center mr-2">
                                  <HeroSolid.UserIcon className="size-6" />
                                </div>
                                <span>{userClient.name}</span>
                              </div>
                            </td>
                            <td>{`level ${k}`}</td>
                            <td>
                              <span
                                className={clsx(
                                  "text-sm text-white px-4 py-1 rounded-sm",
                                  userClient.is_active
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                )}
                              >
                                {userClient.is_active ? "Aktif" : "Tidak Aktif"}
                              </span>
                            </td>
                            <td>{userClient.ihs_id ?? "-"}</td>
                            <td>{userClient.kode_bpjs ?? "-"}</td>
                            <td>
                              <Link
                                to="#"
                                onClick={(e) => e.preventDefault()}
                                className="bg-green-500 text-white px-4 py-2 rounded-sm"
                              >
                                Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="grid grid-cols-1 gap-6 auto-rows-min">
                  <form
                    autoComplete="off"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        setIsProcess(true);
                        await satuSehatFormFn.submit();
                        Toast.fire({
                          icon: "success",
                          title: "Berhasil",
                          text: "Data berhasil disimpan",
                        });
                      } catch {
                        Toast.fire({
                          icon: "error",
                          title: "Gagal",
                          text: "Data gagal disimpan",
                        });
                      } finally {
                        setIsProcess(false);
                      }
                    }}
                    className="bg-white shadow-lg p-6 rounded-md grid grid-cols-1 gap-6 auto-rows-min"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium text-lg">SatuSehat</span>
                        <button
                          type="button"
                          className="hover:bg-slate-200 rounded-full p-1 ml-2 cursor-pointer"
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              satuSehat: {
                                ...prev.satuSehat,
                                showKey: !prev.satuSehat.showKey,
                              },
                            }))
                          }
                        >
                          {settings.satuSehat.showKey ? (
                            <HeroOutline.EyeIcon className="size-5" />
                          ) : (
                            <HeroOutline.EyeSlashIcon className="size-5" />
                          )}
                        </button>
                      </div>
                      {settings.satuSehat.online ? (
                        <span className="text-sm bg-green-500 text-white px-4 py-1 rounded-sm">
                          Online
                        </span>
                      ) : (
                        <span className="text-sm bg-red-500 text-white px-4 py-1 rounded-sm">
                          Offline
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 auto-rows-min">
                      <div className="grid grid-cols-1 gap-4 auto-rows-min">
                        <div className="flex flex-col">
                          <label className="mb-1" htmlFor="satusehat-base-url">
                            Base URL
                          </label>
                          <Select
                            inputId="satusehat-base-url"
                            className="w-full"
                            isClearable={true}
                            isSearchable={true}
                            styles={styles}
                            placeholder="Pilih..."
                            menuPlacement="bottom"
                            required={true}
                            options={mapOptions(dataUrls, {
                              l: "base_url",
                              v: "id",
                            })}
                            value={findValue(
                              dataUrls,
                              { id: satuSehatForm.id_base_url },
                              { label: "base_url", value: "id" }
                            )}
                            onChange={(e) =>
                              cast<{ label: string; value: number }>(
                                e,
                                ({ value }) => {
                                  setSatuSehatForm({ id_base_url: value });
                                }
                              )
                            }
                          />
                        </div>

                        <div className="flex flex-col">
                          <label
                            className="mb-1"
                            htmlFor="satusehat-kode-fasyankes"
                          >
                            Kode fasyankes
                          </label>
                          <input
                            type="text"
                            id="satusehat-kode-fasyankes"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                            value={satuSehatForm.kode_fayankes}
                            onChange={(e) =>
                              setSatuSehatForm({
                                kode_fayankes: e.currentTarget.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex flex-col">
                          <label
                            className="mb-1"
                            htmlFor="satusehat-organization-id"
                          >
                            Organization ID
                          </label>
                          <input
                            type="text"
                            id="satusehat-organization-id"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                            value={satuSehatForm.organization_id}
                            onChange={(e) =>
                              setSatuSehatForm({
                                organization_id: e.currentTarget.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 auto-rows-min">
                        <div className="flex flex-col">
                          <label
                            className="mb-1"
                            htmlFor="satusehat-client-key"
                          >
                            Client Key
                          </label>
                          <input
                            type={
                              settings.satuSehat.showKey ? "text" : "password"
                            }
                            id="satusehat-client-key"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                            value={satuSehatForm.client_key}
                            onChange={(e) =>
                              setSatuSehatForm({
                                client_key: e.currentTarget.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex flex-col">
                          <label
                            className="mb-1"
                            htmlFor="satusehat-secret-key"
                          >
                            Secret Key
                          </label>
                          <input
                            type={
                              settings.satuSehat.showKey ? "text" : "password"
                            }
                            id="satusehat-secret-key"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                            value={satuSehatForm.secret_key}
                            onChange={(e) =>
                              setSatuSehatForm({
                                secret_key: e.currentTarget.value,
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

                  <form
                    autoComplete="off"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        setIsProcess(true);
                        await BPJSPCareFormFn.submit();
                        Toast.fire({
                          icon: "success",
                          title: "Berhasil",
                          text: "Data berhasil disimpan",
                        });
                      } catch {
                        Toast.fire({
                          icon: "error",
                          title: "Gagal",
                          text: "Data gagal disimpan",
                        });
                      } finally {
                        setIsProcess(false);
                      }
                    }}
                    className="bg-white shadow-lg p-6 rounded-md grid grid-cols-1 gap-6 auto-rows-min"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium text-lg">BPJS Pcare</span>
                        <button
                          type="button"
                          className="hover:bg-slate-200 rounded-full p-1 ml-2 cursor-pointer"
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              BPJSPCare: {
                                ...prev.BPJSPCare,
                                showKey: !prev.BPJSPCare.showKey,
                              },
                            }))
                          }
                        >
                          {settings.BPJSPCare.showKey ? (
                            <HeroOutline.EyeIcon className="size-5" />
                          ) : (
                            <HeroOutline.EyeSlashIcon className="size-5" />
                          )}
                        </button>
                      </div>
                      {settings.BPJSPCare.online ? (
                        <span className="text-sm bg-green-500 text-white px-4 py-1 rounded-sm">
                          Online
                        </span>
                      ) : (
                        <span className="text-sm bg-red-500 text-white px-4 py-1 rounded-sm">
                          Offline
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 auto-rows-min">
                      <div className="grid grid-cols-1 gap-4 auto-rows-min">
                        <div className="flex flex-col">
                          <label className="mb-1" htmlFor="bpjs-pcare-base-url">
                            Base URL
                          </label>
                          <Select
                            inputId="bpjs-pcare-base-url"
                            className="w-full"
                            isClearable={true}
                            isSearchable={true}
                            styles={styles}
                            placeholder="Pilih..."
                            menuPlacement="bottom"
                            required={true}
                            options={mapOptions(dataUrls, {
                              l: "base_url",
                              v: "id",
                            })}
                            value={findValue(
                              dataUrls,
                              { id: BPJSPCareForm.id_base_url },
                              { label: "base_url", value: "id" }
                            )}
                            onChange={(e) =>
                              cast<{ label: string; value: number }>(
                                e,
                                ({ value }) => {
                                  setBPJSPCareForm({ id_base_url: value });
                                }
                              )
                            }
                          />
                        </div>

                        <div className="flex flex-col">
                          <label
                            className="mb-1"
                            htmlFor="bpjs-pcare-service-name"
                          >
                            Service Name
                          </label>
                          <input
                            type="text"
                            id="bpjs-pcare-service-name"
                            className={clsx(
                              "border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300",
                              "disabled:bg-gray-200/80 disabled:active:border-gray-300 disabled:focus:border-gray-300"
                            )}
                            disabled={true}
                            value={BPJSPCareForm.service_name}
                          />
                        </div>

                        <div className="flex flex-col">
                          <label
                            className="mb-1"
                            htmlFor="bpjs-pcare-provider-id"
                          >
                            Provider ID
                          </label>
                          <input
                            type="text"
                            id="bpjs-pcare-provider-id"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                            value={BPJSPCareForm.provider_id}
                            onChange={(e) =>
                              setBPJSPCareForm({
                                provider_id: e.currentTarget.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 auto-rows-min">
                        <div className="flex flex-col">
                          <label className="mb-1" htmlFor="bpjs-pcare-cons-id">
                            Cons ID
                          </label>
                          <input
                            type={
                              settings.BPJSPCare.showKey ? "text" : "password"
                            }
                            id="bpjs-pcare-cons-id"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                            required={true}
                            value={BPJSPCareForm.cons_id}
                            onChange={(e) =>
                              setBPJSPCareForm({
                                cons_id: e.currentTarget.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex flex-col">
                          <label
                            className="mb-1"
                            htmlFor="bpjs-pcare-secret-key"
                          >
                            Secret Key
                          </label>
                          <input
                            type={
                              settings.BPJSPCare.showKey ? "text" : "password"
                            }
                            id="bpjs-pcare-secret-key"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                            required={true}
                            value={BPJSPCareForm.secretkey}
                            onChange={(e) =>
                              setBPJSPCareForm({
                                secretkey: e.currentTarget.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="mb-1" htmlFor="bpjs-pcare-user-key">
                            User Key
                          </label>
                          <input
                            type={
                              settings.BPJSPCare.showKey ? "text" : "password"
                            }
                            id="bpjs-pcare-user-key"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                            required={true}
                            value={BPJSPCareForm.userkey}
                            onChange={(e) =>
                              setBPJSPCareForm({
                                userkey: e.currentTarget.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="mb-1" htmlFor="bpjs-pcare-username">
                            Username
                          </label>
                          <input
                            type={
                              settings.BPJSPCare.showKey ? "text" : "password"
                            }
                            id="bpjs-pcare-username"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                            required={true}
                            value={BPJSPCareForm.username}
                            onChange={(e) =>
                              setBPJSPCareForm({
                                username: e.currentTarget.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="mb-1" htmlFor="bpjs-pcare-password">
                            Password
                          </label>
                          <input
                            type={
                              settings.BPJSPCare.showKey ? "text" : "password"
                            }
                            id="bpjs-pcare-password"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                            required={true}
                            value={BPJSPCareForm.password}
                            onChange={(e) =>
                              setBPJSPCareForm({
                                password: e.currentTarget.value,
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

                  <form
                    autoComplete="off"
                    onSubmit={(e) => e.preventDefault()}
                    className="bg-white shadow-lg p-6 rounded-md grid grid-cols-1 gap-6 auto-rows-min"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium text-lg">BPJS Antrol</span>
                        <button
                          type="button"
                          className="hover:bg-slate-200 rounded-full p-1 ml-2 cursor-pointer"
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              BPJSAntrol: {
                                ...prev.BPJSAntrol,
                                showKey: !prev.BPJSAntrol.showKey,
                              },
                            }))
                          }
                        >
                          {settings.BPJSAntrol.showKey ? (
                            <HeroOutline.EyeIcon className="size-5" />
                          ) : (
                            <HeroOutline.EyeSlashIcon className="size-5" />
                          )}
                        </button>
                      </div>
                      {settings.BPJSAntrol.online ? (
                        <span className="text-sm bg-green-500 text-white px-4 py-1 rounded-sm">
                          Online
                        </span>
                      ) : (
                        <span className="text-sm bg-red-500 text-white px-4 py-1 rounded-sm">
                          Offline
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 auto-rows-min">
                      <div className="grid grid-cols-1 gap-4 auto-rows-min">
                        <div className="flex flex-col">
                          <label
                            className="mb-1"
                            htmlFor="bpjs-antrol-base-url"
                          >
                            Base Url
                          </label>
                          <input
                            type="text"
                            id="bpjs-antrol-base-url"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                            value={BPJSAntrolForm[1]}
                            onChange={(e) =>
                              setBPJSAntrolForm({ "1": e.currentTarget.value })
                            }
                          />
                        </div>

                        <div className="flex flex-col">
                          <label
                            className="mb-1"
                            htmlFor="bpjs-antrol-service-name"
                          >
                            Service Name
                          </label>
                          <input
                            type="text"
                            id="bpjs-antrol-service-name"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                            value={BPJSAntrolForm[2]}
                            onChange={(e) =>
                              setBPJSAntrolForm({ "2": e.currentTarget.value })
                            }
                          />
                        </div>

                        <div className="flex flex-col">
                          <label
                            className="mb-1"
                            htmlFor="bpjs-antrol-provider-id"
                          >
                            Provider Id
                          </label>
                          <input
                            type="text"
                            id="bpjs-antrol-provider-id"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                            value={BPJSAntrolForm[3]}
                            onChange={(e) =>
                              setBPJSAntrolForm({ "3": e.currentTarget.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 auto-rows-min">
                        <div className="flex flex-col">
                          <label className="mb-1" htmlFor="bpjs-antrol-cons-id">
                            Cons Id
                          </label>
                          <input
                            type={
                              settings.BPJSAntrol.showKey ? "text" : "password"
                            }
                            id="bpjs-antrol-cons-id"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                            value={BPJSAntrolForm[4]}
                            onChange={(e) =>
                              setBPJSAntrolForm({ "4": e.currentTarget.value })
                            }
                          />
                        </div>

                        <div className="flex flex-col">
                          <label
                            className="mb-1"
                            htmlFor="bpjs-antrol-secret-key"
                          >
                            Secret Key
                          </label>
                          <input
                            type={
                              settings.BPJSAntrol.showKey ? "text" : "password"
                            }
                            id="bpjs-antrol-secret-key"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                            value={BPJSAntrolForm[5]}
                            onChange={(e) =>
                              setBPJSAntrolForm({ "5": e.currentTarget.value })
                            }
                          />
                        </div>

                        <div className="flex flex-col">
                          <label
                            className="mb-1"
                            htmlFor="bpjs-antrol-user-key"
                          >
                            User Key
                          </label>
                          <input
                            type={
                              settings.BPJSAntrol.showKey ? "text" : "password"
                            }
                            id="bpjs-antrol-user-key"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                            value={BPJSAntrolForm[6]}
                            onChange={(e) =>
                              setBPJSAntrolForm({ "6": e.currentTarget.value })
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
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>

        <div className="grid grid-cols-1 auto-rows-min gap-6">
          <div>
            <div className="bg-white shadow-lg p-6 rounded-md flex flex-col">
              <div className="flex flex-col mb-3">
                <span className="font-medium">Current plan</span>
                <span className="text-gray-400 text-sm">31 Desember 2025</span>
              </div>
              <div className="flex flex-col mb-3">
                <span className="text-sm">16 Users</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm">Estimasi tagihan bulan ini</span>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer rounded-sm"
                >
                  Rp. 546.600
                </button>
              </div>
            </div>
          </div>

          <div>
            <div>
              <span className="font-medium text-lg">Billing</span>
            </div>
            <div className="bg-white shadow-lg rounded-md border border-gray-200 overflow-hidden">
              <ul>
                {Array.from({ length: 10 }, (_, k) => (
                  <li key={k}>
                    <div
                      className={clsx(
                        "w-full px-4 py-2.5 hover:bg-slate-100 flex items-center justify-between",
                        k !== 9 && "border-b border-b-gray-200"
                      )}
                    >
                      <div>{`Billing ${k}`}</div>
                      <div className="font-medium">Rp. 1.000.000</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;

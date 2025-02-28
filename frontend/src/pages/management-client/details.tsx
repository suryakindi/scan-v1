import { FC, FormEventHandler, useEffect } from "react";
import { api, useXState } from "../../utils/api";
import { Link, useLoaderData, useParams } from "react-router";
import { AxiosRequestConfig } from "axios";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useLokasi } from "../../utils/lokasi/lokasi";
import Swal from "sweetalert2";
import * as HeroSolid from "@heroicons/react/24/solid";
import * as HeroOutline from "@heroicons/react/24/outline";
import clsx from "clsx";

const Details: FC = () => {
  const param = useParams();
  const { token } = useLoaderData<LoaderT>();
  const requestConfig: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const [
    { provinces, regencies, districts, villages },
    { getProvinces, getRegencies, getDistricts, getVillages },
  ] = useLokasi();

  const [clientForm, setClientForm, clientFn] = useXState<
    CreateClientPropsT,
    UpdateClientPropsT
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

  const getClientById = async (id: string | number) => {
    try {
      const response = await api.get<ResponseT<ClientT>>(
        `/management/get-client/id/${id}`,
        requestConfig
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

  const handleSaveClientSubmit: FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    try {
      await clientFn.submit();
      Swal.fire({
        timer: 1000,
        showConfirmButton: false,
        position: "top-right",
        toast: true,
        icon: "success",
        title: "Berhasil",
        text: "Berhasil mengubah data",
      });
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
                          {![
                            clientForm.provinsi_id,
                            clientForm.kabupaten_id,
                          ].includes("") &&
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
                          <th>SATUSEHAT</th>
                          <th>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 20 }, (_, k) => (
                          <tr key={k}>
                            <td>{k + 1}</td>
                            <td>
                              <div className="flex items-center w-full pl-4">
                                <div className="flex w-10 h-10 bg-blue-400 text-white rounded-full items-center justify-center mr-2">
                                  <HeroSolid.UserIcon className="size-6" />
                                </div>
                                <span>{`nama ${k}`}</span>
                              </div>
                            </td>
                            <td>{`level ${k}`}</td>
                            <td>
                              <span className="text-sm bg-green-500 text-white px-4 py-1 rounded-sm">
                                Aktif
                              </span>
                            </td>
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
                <form
                  autoComplete="off"
                  onSubmit={() => {}}
                  className="grid grid-cols-1 gap-6 auto-rows-min"
                >
                  <div className="bg-white shadow-lg p-6 rounded-md grid grid-cols-1 gap-4 auto-rows-min">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium text-lg">SatuSehat</span>
                        <button
                          type="button"
                          className="hover:bg-slate-200 rounded-full p-1 ml-2"
                        >
                          <HeroOutline.EyeSlashIcon className="size-5" />
                        </button>
                      </div>
                      <span className="text-sm bg-green-500 text-white px-4 py-1 rounded-sm">
                        Online
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 auto-rows-min">
                      <div className="grid grid-cols-1 gap-4 auto-rows-min">
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
                            type="text"
                            id="satusehat-client-key"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
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
                            type="text"
                            id="satusehat-secret-key"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white shadow-lg p-6 rounded-md grid grid-cols-1 gap-4 auto-rows-min">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium text-lg">BPJS Pcare</span>
                        <button
                          type="button"
                          className="hover:bg-slate-200 rounded-full p-1 ml-2"
                        >
                          <HeroOutline.EyeSlashIcon className="size-5" />
                        </button>
                      </div>
                      <span className="text-sm bg-green-500 text-white px-4 py-1 rounded-sm">
                        Online
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 auto-rows-min">
                      <div className="grid grid-cols-1 gap-4 auto-rows-min">
                        <div className="flex flex-col">
                          <label
                            className="mb-1"
                            htmlFor="bpjs-pcare-kode-aplikasi"
                          >
                            Kode Aplikasi
                          </label>
                          <input
                            type="text"
                            id="bpjs-pcare-kode-aplikasi"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="mb-1" htmlFor="bpjs-pcare-base-url">
                            Base URL
                          </label>
                          <input
                            type="text"
                            id="bpjs-pcare-base-url"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
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
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
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
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 auto-rows-min">
                        <div className="flex flex-col">
                          <label className="mb-1" htmlFor="bpjs-pcare-cons-id">
                            Cons ID
                          </label>
                          <input
                            type="text"
                            id="bpjs-pcare-cons-id"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
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
                            type="text"
                            id="bpjs-pcare-secret-key"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="mb-1" htmlFor="bpjs-pcare-user-key">
                            User Key
                          </label>
                          <input
                            type="text"
                            id="bpjs-pcare-user-key"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="mb-1" htmlFor="bpjs-pcare-username">
                            Username
                          </label>
                          <input
                            type="text"
                            id="bpjs-pcare-username"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="mb-1" htmlFor="bpjs-pcare-password">
                            Password
                          </label>
                          <input
                            type="text"
                            id="bpjs-pcare-password"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white shadow-lg p-6 rounded-md grid grid-cols-1 gap-4 auto-rows-min">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium text-lg">BPJS Antrol</span>
                        <button
                          type="button"
                          className="hover:bg-slate-200 rounded-full p-1 ml-2"
                        >
                          <HeroOutline.EyeSlashIcon className="size-5" />
                        </button>
                      </div>
                      <span className="text-sm bg-green-500 text-white px-4 py-1 rounded-sm">
                        Online
                      </span>
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
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 auto-rows-min">
                        <div className="flex flex-col">
                          <label className="mb-1" htmlFor="bpjs-antrol-cons-id">
                            Cons Id
                          </label>
                          <input
                            type="text"
                            id="bpjs-antrol-cons-id"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
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
                            type="text"
                            id="bpjs-antrol-secret-key"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
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
                            type="text"
                            id="bpjs-antrol-user-key"
                            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer rounded-sm"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
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

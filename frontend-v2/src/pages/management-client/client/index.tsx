import Modal from "@/components/modal";
import Spinner from "@/components/spinner";
import { AddButton } from "@/components/table";
import {
  ClientObject,
  DistrictObject,
  Paginate,
  ProvinceObject,
  RegencieObject,
  VillageObject,
  XHRStatus,
} from "@/utils/global-types";
import { AppState } from "@/utils/state";
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconExclamationCircle,
  IconEye,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import {
  FC,
  FormEventHandler,
  Fragment,
  JSX,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import service, { ClientPayload } from "./service";
import { Link } from "react-router";
import paginate from "@/utils/paginate";
import Button from "@/components/button";
import { Confirm } from "@/utils/sweetalert2";

const Client: FC = () => {
  const token = useSelector((state: AppState) => state.token);
  const [data, setData] = useState<Paginate<ClientObject[]>>(paginate.init());
  const [xhrStatus, setXhrStatus] = useState<XHRStatus>("loading");
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
  const [addClient, setAddClient] = useState<ClientPayload>(
    service.initClientPayload()
  );
  const [provinces, setProvinces] = useState<ProvinceObject[]>([]);
  const [regencies, setRegencies] = useState<RegencieObject[]>([]);
  const [districts, setDistricts] = useState<DistrictObject[]>([]);
  const [villages, setVillages] = useState<VillageObject[]>([]);

  const preload = async () =>
    await service
      .getData(token)
      .then(({ data }) => {
        console.log(data);

        if (data.data) {
          setData(data.data);
          setXhrStatus("success");
        } else {
          setXhrStatus("error");
        }
      })
      .catch(() => {
        setXhrStatus("error");
      });

  const handleAddClient: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault();
      await service.addData(token, addClient);
      await preload();
    } catch (error) {
      console.error(error);
    } finally {
      setShowModalAdd(false);
    }
  };

  useEffect(() => {
    preload();
    service
      .getProvinces()
      .then(({ data: { data } }) => setProvinces(data ?? []));
  }, []);

  return (
    <Fragment>
      <div className="flex flex-1 flex-col">
        <div className="bg-white rounded-md overflow-hidden flex flex-col">
          <div className="p-5 flex items-center justify-between">
            <span className="font-medium text-xl">Client</span>
            <div className="flex items-center gap-2.5">
              <AddButton onClick={() => setShowModalAdd(true)} />
            </div>
          </div>
          <div className="max-h-[70vh] overflow-y-scroll">
            <table className="w-full sticky-header-table text-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>NAMA FASKES</th>
                  <th>KAB/KOTA</th>
                  <th>BPJS</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {
                  (
                    {
                      error: (
                        <tr>
                          <td colSpan={5} className="text-center">
                            <div className="flex items-center justify-center gap-2.5">
                              <IconExclamationCircle className="size-6" />
                              <span>Error loading data</span>
                            </div>
                          </td>
                        </tr>
                      ),
                      loading: (
                        <tr>
                          <td colSpan={5} className="text-center">
                            <div className="flex items-center justify-center gap-2.5">
                              <Spinner />
                              <span>Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ),
                      success:
                        data.data.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center">
                              <div className="flex items-center justify-center gap-2.5">
                                <IconExclamationCircle className="size-6" />
                                <span>Data masih kosong</span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          data.data.map((item, k) => (
                            <tr key={k}>
                              <td>{k + 1}</td>
                              <td>{item.nama_client}</td>
                              <td>{item.alamat}</td>
                              <td>{item.connect_bpjs}</td>
                              <td>
                                <div className="flex items-center gap-2.5 w-full justify-center">
                                  <Link
                                    to="/"
                                    className="cursor-pointer text-white bg-indigo-700 hover:bg-indigo-500 hover:scale-110 transition-all duration-300 rounded-sm p-2.5"
                                  >
                                    <IconEye className="size-6" />
                                  </Link>
                                  <button
                                    type="button"
                                    className="cursor-pointer text-white bg-red-700 hover:bg-red-500 hover:scale-110 transition-all duration-300 rounded-sm p-2.5"
                                    onClick={() =>
                                      Confirm.fire({
                                        title: "Hapus client",
                                        text: "Hapus client ?",
                                      }).then(({ isConfirmed }) => {
                                        isConfirmed &&
                                          service
                                            .deleteData(token, item.id)
                                            .then(() => preload());
                                      })
                                    }
                                  >
                                    <IconTrash className="size-6" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ),
                    } as Record<XHRStatus, JSX.Element>
                  )[xhrStatus]
                }
              </tbody>
            </table>
          </div>
          <div className="p-5 flex items-center justify-end">
            <div className="flex items-center gap-5">
              <span>Rows per page</span>
              <select>
                {[10, 25, 100].map((i) => (
                  <option value={i} key={i}>
                    {i}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="cursor-pointer hover:bg-slate-200 p-2 flex items-center justify-center rounded-full"
                >
                  <IconChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  className="cursor-pointer hover:bg-slate-200 p-2 flex items-center justify-center rounded-full"
                >
                  <IconChevronRight className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* add */}
      <Modal show={showModalAdd} onClose={() => setShowModalAdd(false)}>
        <form className="flex flex-col" onSubmit={handleAddClient}>
          <div className="flex flex-col overflow-y-auto max-h-[70vh] gap-5 pb-5">
            <div>
              <label
                htmlFor="nama-client"
                className="block mb-1 text-sm font-medium"
              >
                Nama Client
              </label>
              <input
                type="text"
                id="nama-client"
                className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
                placeholder="Nama Client"
                required
                value={addClient.nama_client}
                onChange={({ currentTarget: { value } }) =>
                  setAddClient((prev) => ({ ...prev, nama_client: value }))
                }
              />
            </div>
            <div>
              <label
                htmlFor="no-telpon"
                className="block mb-1 text-sm font-medium"
              >
                No Telpon
              </label>
              <input
                type="text"
                id="no-telpon"
                className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
                placeholder="No Telpon"
                required
                value={addClient.notelp}
                onChange={({ currentTarget: { value } }) =>
                  setAddClient((prev) => ({ ...prev, notelp: value }))
                }
              />
            </div>
            <div>
              <label
                htmlFor="website"
                className="block mb-1 text-sm font-medium"
              >
                Website
              </label>
              <input
                type="text"
                id="website"
                className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
                placeholder="Website"
                required
                value={addClient.website}
                onChange={({ currentTarget: { value } }) =>
                  setAddClient((prev) => ({ ...prev, website: value }))
                }
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="text"
                id="email"
                className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
                placeholder="Email"
                required
                value={addClient.email}
                onChange={({ currentTarget: { value } }) =>
                  setAddClient((prev) => ({ ...prev, email: value }))
                }
              />
            </div>
            <div>
              <label
                htmlFor="alamat"
                className="block mb-1 text-sm font-medium"
              >
                Alamat
              </label>
              <input
                type="text"
                id="alamat"
                className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
                placeholder="Alamat"
                required
                value={addClient.alamat}
                onChange={({ currentTarget: { value } }) =>
                  setAddClient((prev) => ({ ...prev, alamat: value }))
                }
              />
            </div>
            <div>
              <label
                htmlFor="provinsi"
                className="block mb-1 text-sm font-medium"
              >
                Provinsi
              </label>
              <select
                id="provinsi"
                className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
                value={addClient.provinsi_id}
                onChange={({ currentTarget: { value } }) => {
                  setAddClient((prev) => ({
                    ...prev,
                    provinsi_id: value,
                    kabupaten_id: "",
                    kecamatan_id: "",
                    kelurahan_id: "",
                  }));
                  service
                    .getRegencies(Number(value))
                    .then(({ data: { data } }) => setRegencies(data ?? []))
                    .catch(() => setRegencies([]))
                    .finally(() => {
                      setDistricts([]);
                      setVillages([]);
                    });
                }}
              >
                <option value="">Pilih</option>
                {provinces.map((item, k) => (
                  <option value={item.id} key={k}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="kota" className="block mb-1 text-sm font-medium">
                Kota
              </label>
              <select
                id="kota"
                className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
                value={addClient.kabupaten_id}
                onChange={({ currentTarget: { value } }) => {
                  setAddClient((prev) => ({
                    ...prev,
                    kabupaten_id: value,
                    kecamatan_id: "",
                    kelurahan_id: "",
                  }));
                  service
                    .getDistricts(Number(value))
                    .then(({ data: { data } }) => setDistricts(data ?? []))
                    .catch(() => setDistricts([]))
                    .finally(() => {
                      setVillages([]);
                    });
                }}
              >
                <option value="">Pilih</option>
                {regencies.map((item, k) => (
                  <option value={item.id} key={k}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="kecamatan"
                className="block mb-1 text-sm font-medium"
              >
                Kecamatan
              </label>
              <select
                id="kecamatan"
                className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
                value={addClient.kecamatan_id}
                onChange={({ currentTarget: { value } }) => {
                  setAddClient((prev) => ({
                    ...prev,
                    kecamatan_id: value,
                    kelurahan_id: "",
                  }));
                  service
                    .getVillages(Number(value))
                    .then(({ data: { data } }) => setVillages(data ?? []))
                    .catch(() => setVillages([]));
                }}
              >
                <option value="">Pilih</option>
                {districts.map((item, k) => (
                  <option value={item.id} key={k}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="kelurahan"
                className="block mb-1 text-sm font-medium"
              >
                Kelurahan
              </label>
              <select
                id="kelurahan"
                className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
                value={addClient.kelurahan_id}
                onChange={({ currentTarget: { value } }) =>
                  setAddClient((prev) => ({ ...prev, kelurahan_id: value }))
                }
              >
                <option value="">Pilih</option>
                {villages.map((item, k) => (
                  <option value={item.id} key={k}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="koordinat-1"
                className="block mb-1 text-sm font-medium"
              >
                Koordinat 1
              </label>
              <input
                type="text"
                id="koordinat-1"
                className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
                placeholder="Koordinat 1"
                required
                value={addClient.koordinat1}
                onChange={({ currentTarget: { value } }) =>
                  setAddClient((prev) => ({ ...prev, koordinat1: value }))
                }
              />
            </div>
            <div>
              <label
                htmlFor="koordinat-2"
                className="block mb-1 text-sm font-medium"
              >
                Koordinat 2
              </label>
              <input
                type="text"
                id="koordinat-2"
                className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
                placeholder="Koordinat 2"
                required
                value={addClient.koordinat2}
                onChange={({ currentTarget: { value } }) =>
                  setAddClient((prev) => ({ ...prev, koordinat2: value }))
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2.5">
            <Button
              type="button"
              onClick={() => setAddClient(service.initClientPayload())}
            >
              <IconX className="size-6" />
            </Button>
            <Button type="submit">
              <IconCheck className="size-6" />
            </Button>
          </div>
        </form>
      </Modal>
    </Fragment>
  );
};

export default Client;

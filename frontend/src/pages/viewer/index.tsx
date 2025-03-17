import clsx from "clsx";
import { FC, FormEventHandler, Fragment, useEffect, useState } from "react";
import Select from "react-select";
import Modal from "../../components/modal/Modal";
import { cast, findValue, mapOptions, styles } from "../../utils/react-select";
import * as HSolid from "@heroicons/react/24/solid";
import { api, ResponseT, useXState } from "../../utils/api";
import { paginateInit, PaginateT } from "../../utils/paginate";
import { ClientT } from "../management-client/client/types";
import { RuanganT } from "../registrasi/pasien/types";
import { BarLoader } from "react-spinners";
import { useNavigate } from "react-router";

const Viewer: FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModalClient, setShowModalClient] = useState<boolean>(false);

  const [clients, setClients] = useState<PaginateT<ClientT[]>>(paginateInit());

  type _T1 = {
    id_user: number;
    name: string;
    nama_ruangan: string;
  };

  const [dokters, setDokters] = useState<PaginateT<_T1[]>>(paginateInit());

  const getAllClients = async () => {
    try {
      const response = await api.get<ResponseT<PaginateT<ClientT[]>>>(
        "/viewer/get-clients"
      );
      if (response.data.data) {
        setClients(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [ruangans, setRuangans] = useState<PaginateT<RuanganT[]>>(
    paginateInit()
  );

  const getMasterRuanganByClientId = async (id: number | string) => {
    try {
      const response = await api.get<ResponseT<PaginateT<RuanganT[]>>>(
        `/viewer/get-master-ruangan/${id}`
      );

      if (response.data.data) {
        setRuangans(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMappingDokterArray = async (ids: number[]) => {
    try {
      const response = await api.get("/viewer/get-mapping-dokter-array", {
        params: { ids },
      });
      if (response.data.data) {
        setDokters(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [form, setForm] = useXState<{
    client_id: number | null;
    ruangan_ids: number[];
    dokters: _T1[];
  }>({ client_id: null, ruangan_ids: [], dokters: [] }, {});

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    localStorage.setItem("queue", JSON.stringify(form));
    navigate("/viewer/display");
  };

  useEffect(() => {
    return () => {
      const load = async () => {
        setIsLoading(true);
        await getAllClients();
        setIsLoading(false);
      };
      load();
    };
  }, []);
  return (
    <Fragment>
      <div className="flex items-center justify-center p-6">
        <div className="w-1/3 grid grid-cols-1 items-center gap-6">
          <div className="flex justify-center">
            <div className="w-28">
              <img src="/images/logo_bg_transparent.png" alt="logo" />
            </div>
          </div>
          <div className="flex justify-center">
            <span className="text-3xl font-bold">
              SCAN Nusantara Queuing System
            </span>
          </div>
          <div className="flex justify-center">
            <img src="/images/viewer-bg.png" alt="viewer-bg" />
          </div>
          <button
            type="button"
            className={clsx(
              "flex items-center justify-center px-3 py-1.5 text-white cursor-pointer rounded-full font-bold",
              "bg-orange-600 hover:bg-orange-500"
            )}
            onClick={() => setShowModalClient(true)}
          >
            Client
          </button>
        </div>
      </div>

      <Modal show={showModalClient} onClose={() => setShowModalClient(false)}>
        <div className="grid grid-cols-1 gap-4 auto-rows-min">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 auto-rows-min"
          >
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="nama-client">
                Client
              </label>
              <Select
                inputId="nama-client"
                className="w-full"
                isSearchable={true}
                styles={styles}
                placeholder="Pilih..."
                menuPlacement="bottom"
                required={true}
                options={mapOptions(clients.data, {
                  l: "nama_client",
                  v: "id",
                })}
                value={findValue(
                  clients.data,
                  {
                    id: form.client_id ?? undefined,
                  },
                  { label: "nama_client", value: "id" }
                )}
                onChange={(e) =>
                  cast<{ label: string; value: number }>(
                    e,
                    async ({ value }) => {
                      setIsLoading(true);
                      setForm({ client_id: value, ruangan_ids: [] });
                      await getMasterRuanganByClientId(value);
                      setIsLoading(false);
                    }
                  )
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1" htmlFor="poli">
                Poli
              </label>
              <Select
                inputId="poli"
                className="w-full"
                isClearable={true}
                closeMenuOnSelect={false}
                isSearchable={true}
                styles={styles}
                placeholder="Pilih..."
                menuPlacement="bottom"
                required={true}
                isMulti={true}
                options={
                  form.client_id
                    ? mapOptions(ruangans.data, {
                        l: "nama_ruangan",
                        v: "id",
                      })
                    : []
                }
                value={mapOptions(
                  ruangans.data.filter(({ id }) =>
                    form.ruangan_ids.includes(id)
                  ),
                  { l: "nama_ruangan", v: "id" }
                )}
                onChange={(e) =>
                  cast<{ label: string; value: number }[]>(e, async (items) => {
                    setIsLoading(true);
                    const ids = items.map(({ value }) => value);
                    setForm({ ruangan_ids: ids });
                    await getMappingDokterArray(ids);
                    setIsLoading(false);
                  })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1" htmlFor="dokter">
                Dokter
              </label>
              <Select
                inputId="dokter"
                className="w-full"
                isClearable={true}
                closeMenuOnSelect={false}
                isSearchable={true}
                styles={styles}
                placeholder="Pilih..."
                menuPlacement="bottom"
                required={true}
                isMulti={true}
                options={dokters.data}
                getOptionLabel={(e) => {
                  const selected = e as _T1;
                  return `${selected.name} - ${selected.nama_ruangan}`;
                }}
                value={form.dokters}
                onChange={(e) => {
                  const selected = e as _T1[];
                  setForm({ dokters: selected });
                }}
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white cursor-pointer rounded-sm"
              >
                <HSolid.CheckIcon className="size-6 mr-2" />
                <span>Simpan</span>
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {isLoading && (
        <div className="fixed top-0 right-0 left-0 z-50 bg-white/50">
          <BarLoader
            color="#1447e6"
            height={3}
            loading={true}
            speedMultiplier={1}
            width="100%"
          />
        </div>
      )}
    </Fragment>
  );
};

export default Viewer;

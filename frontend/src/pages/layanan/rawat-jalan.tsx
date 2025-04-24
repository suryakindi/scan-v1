import clsx from "clsx";
import { FC, useEffect, useState } from "react";
import * as HOutline from "@heroicons/react/24/outline";
import Select from "react-select";
import { cast, findValue, mapOptions, styles } from "../../utils/react-select";
import { api, ResponseT } from "../../utils/api";
import { paginateInit, PaginateT } from "../../utils/paginate";
import useWebSocket from "react-use-websocket";
import { Link, useLoaderData, useOutletContext } from "react-router";
import { LoaderT } from "../../user";
import { Toast } from "../../utils/alert";
import moment from "moment";
import { RuanganT } from "../registrasi/pasien/types";
import { LayoutContext } from "../../layout/types";

type Data = {
  id_registrasi: number;
  nama: string;
  id_ruangan: number;
  waktu_pemanggilan: string | null;
  id_status_pulang: string | null;
  status_pulang: string | null;
  id_status_pasien: number;
  status_pasien: string;
  noantrian: string;
  noantrianbpjs: string;
  no_registrasi: string;
  tanggal_registrasi: string;
  nama_ruangan: string;
  selisih_waktu: string | null;
};

const RawatJalan: FC = () => {
  const { user } = useLoaderData<LoaderT>();
  const { setIsProcess } = useOutletContext<LayoutContext>();

  const { sendMessage } = useWebSocket("ws://localhost:3000/socket/call", {
    shouldReconnect: () => true,
    onOpen: () => console.log("WebSocket connection opened!"),
    onClose: () => console.log("WebSocket connection closed!"),
    onError: (event: unknown) => console.error("WebSocket error:", event),
    onMessage: (event: unknown) => console.log("Received message:", event),
  });

  const [data, setData] = useState<PaginateT<Data[]>>(paginateInit([]));

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

  const [filters, setFilters] = useState<{
    tglAwal: string;
    tglAkhir: string;
    ruangan: string;
    search: string;
    is_dokter: boolean;
  }>({
    ruangan: "",
    search: "",
    tglAkhir: moment().format("YYYY-MM-DD"),
    tglAwal: moment().format("YYYY-MM-DD"),
    is_dokter: false,
  });

  const getData = async (
    url: string = "/layanan/daftar-pasien/teregistrasi"
  ) => {
    try {
      // cuma dummy
      const base = url.startsWith("http") ? undefined : "http://localhost";
      const parsedUrl = new URL(url, base);

      const queryObject = Object.fromEntries(parsedUrl.searchParams.entries());

      const response = await api.get<ResponseT<PaginateT<Data[]>>>(url, {
        params: {
          ...filters,
          tglAwal: filters.tglAwal.split("-").reverse().join("-"),
          tglAkhir: filters.tglAkhir.split("-").reverse().join("-"),
          ...queryObject,
        },
      });

      if (response.data.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    getData();
    getMasterRuangan();
  }, []);

  const call = async (antrean: Data) => {
    try {
      sendMessage(JSON.stringify({ cdfix: user.cdfix, data: antrean }));
      await api.put(
        `/layanan/update-waktu-pemanggilan/${antrean.id_registrasi}`
      );
      getData();
      Toast.fire({
        title: "Berhasil",
        text: "Berhasil memanggil pasien",
        icon: "success",
      });
    } catch (error) {
      Toast.fire({
        title: "Gagal",
        text: "Gagal memanggil pasien",
        icon: "error",
      });
      console.error(error);
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-md mb-6 grid gap-4 auto-rows-min">
      <div className="grid grid-cols-4 gap-3">
        <div className="h-full flex items-center">
          <span className="font-medium">Rawat Jalan</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex">
            <input
              type="checkbox"
              className="border size-6"
              checked={filters.is_dokter}
              onChange={() =>
                setFilters((prev) => ({
                  ...prev,
                  is_dokter: !prev.is_dokter,
                }))
              }
            />
          </div>

          <div className="flex items-center gap-1 flex-1">
            <input
              type="date"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300 w-full"
              value={filters.tglAwal}
              onChange={({ currentTarget: { value } }) =>
                setFilters((prev) => ({
                  ...prev,
                  tglAwal: value,
                }))
              }
            />
            <span>s/d</span>
            <input
              type="date"
              className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300 w-full"
              value={filters.tglAkhir}
              onChange={({ currentTarget: { value } }) =>
                setFilters((prev) => ({
                  ...prev,
                  tglAkhir: value,
                }))
              }
            />
          </div>
        </div>

        <Select
          inputId="poliklinik-klinik"
          className="w-full"
          isSearchable={true}
          styles={styles}
          placeholder="Pilih..."
          menuPlacement="bottom"
          required={true}
          isClearable={true}
          options={mapOptions(ruangans.data, {
            l: "nama_ruangan",
            v: "nama_ruangan",
          })}
          value={findValue(
            ruangans.data,
            {
              nama_ruangan: filters.ruangan,
            },
            { label: "nama_ruangan", value: "nama_ruangan" }
          )}
          onChange={(e) =>
            cast<{ label: string; value: string }>(e, async ({ value }) => {
              setFilters((prev) => ({ ...prev, ruangan: value }));
            })
          }
          components={{
            ClearIndicator: () => {
              return (
                <button
                  type="button"
                  className="size-5 flex items-center justify-center cursor-pointer rounded-full"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, ruangan: "" }))
                  }
                >
                  <HOutline.XMarkIcon className="size-4 text-gray-300" />
                </button>
              );
            },
            Option: ({ innerProps, children, isSelected }) => {
              return (
                <div
                  {...innerProps}
                  className={clsx(
                    "px-3 py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between",
                    isSelected && "bg-slate-200"
                  )}
                >
                  {children}
                  {isSelected && <HOutline.CheckIcon className="size-4" />}
                </div>
              );
            },
          }}
        />

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="No RM, NIK, Nama Pasien"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300 w-full"
            value={filters.search}
            onChange={({ currentTarget: { value } }) => {
              setFilters((prev) => ({
                ...prev,
                search: value,
              }));
            }}
          />

          <button
            onClick={async () => {
              setIsProcess(true);
              await getData();
              setIsProcess(false);
            }}
            className="py-1.5 px-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-md flex items-center justify-center outline-none text-nowrap h-full gap-2 cursor-pointer"
          >
            <HOutline.MagnifyingGlassIcon className="size-6" />
            <span>Cari</span>
          </button>
        </div>
      </div>

      <table className="me-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>No Antrian BPJS</th>
            <th>Nama</th>
            <th>Ruangan</th>
            <th>Statu Pulang</th>
            <th>Waiting</th>
            <th>Status</th>
            <th>M.Records</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((item, k) => (
            <tr key={k}>
              <td>
                <div className="size-8 bg-green-200 text-green-600 flex items-center justify-center rounded-full m-auto">
                  {item.noantrian}
                </div>
              </td>
              <td>
                <div
                  className={`size-8 flex items-center justify-center rounded-full m-auto ${
                    item.noantrianbpjs
                      ? "bg-green-200 text-green-600"
                      : "bg-red-200 text-red-600"
                  }`}
                >
                  {item.noantrianbpjs ?? "-"}
                </div>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <div className="size-8 bg-blue-200 text-blue-600 flex items-center justify-center rounded-full">
                    {k % 2 === 0 ? "L" : "P"}
                  </div>
                  <span>{item.nama}</span>
                </div>
              </td>
              <td>{item.nama_ruangan}</td>
              <td>{item.status_pulang}</td>
              <td>
                {item.selisih_waktu && (
                  <span className="text-sm bg-gray-500 text-white px-4 py-1 rounded-sm">
                    {item.selisih_waktu}
                  </span>
                )}
              </td>
              <td>
                <div className="flex bg-slate-500 text-white mx-auto rounded-full px-1.5 py-0.5 justify-between items-center max-w-36">
                  <span className="text-sm">{item.status_pasien}</span>
                  <span
                    className={clsx("w-4 h-4 block rounded-full", {
                      "bg-red-600": item.status_pasien === "Belum Dilayani",
                      "bg-yellow-600": item.status_pasien === "Dilayani",
                      "bg-green-600": item.status_pasien === "Selesai",
                      "bg-black": item.status_pasien === "Pulang",
                    })}
                  ></span>
                </div>
              </td>
              <td>
                <div className="rounded-md overflow-hidden flex items-center mx-auto h-10 w-max">
                  <Link
                    to={`/registrasi/soap/${item.id_registrasi}`}
                    className="flex items-center bg-green-600 hover:bg-green-500 text-white px-3 h-full cursor-pointer"
                  >
                    M.Records
                  </Link>
                  <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 h-full flex items-center justify-center cursor-pointer"
                    onClick={() => call(item)}
                  >
                    <HOutline.SpeakerWaveIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RawatJalan;

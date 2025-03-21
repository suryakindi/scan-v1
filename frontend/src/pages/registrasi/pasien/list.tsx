import { FC, useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router";
import * as HOutline from "@heroicons/react/24/outline";
import { api, ResponseT } from "../../../utils/api";
import { paginateInit, PaginateT } from "../../../utils/paginate";
import { PasienT } from "./types";
import clsx from "clsx";
import { LayoutContext } from "../../../layout/types";

const ListPasien: FC = () => {
  const { setIsProcess } = useOutletContext<LayoutContext>();
  const [pasiens, setPasiens] = useState<PaginateT<PasienT[]>>(paginateInit());

  const [search, setSearch] = useState<string>("");
  const getPasiens = async (url: string = "/pasien/get-pasien") => {
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const response = await api.get<ResponseT<PaginateT<PasienT[]>>>(
        `${url}${query}`
      );

      if (response.data.data) {
        setPasiens(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    const load = async () => {
      setIsProcess(true);
      await getPasiens();
      setIsProcess(false);
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="bg-white shadow-lg p-6 rounded-md mb-6 grid gap-4 auto-rows-min">
      <div className="flex w-1/2 items-center gap-2">
        <input
          type="text"
          placeholder="No RM, NIK, Nama Pasien"
          className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300 w-full"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />

        <button
          onClick={async () => {
            setIsProcess(true);
            await getPasiens();
            setIsProcess(false);
          }}
          className="py-1.5 px-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-md flex items-center justify-center outline-none text-nowrap h-full gap-2 cursor-pointer"
        >
          <HOutline.MagnifyingGlassIcon className="size-6" />
          <span>Cari</span>
        </button>
        <Link
          to="/registrasi/pasien"
          className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md flex items-center justify-center outline-none text-nowrap h-full gap-2 cursor-pointer"
        >
          <HOutline.PlusIcon className="size-6" />
          <span>Pasien Baru</span>
        </Link>
      </div>
      <table className="me-table">
        <thead>
          <tr>
            <th>NO</th>
            <th>Nama</th>
            <th>NIK</th>
            <th>Tgl Lahir</th>
            <th>No RM</th>
            <th>No BPJS</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {pasiens.data.map((item, key) => (
            <tr key={key}>
              <td>{key + 1}</td>
              <td>{item.nama}</td>
              <td>{item.nik}</td>
              <td>{item.tanggal_lahir}</td>
              <td>{item.norm}</td>
              <td>{item.no_bpjs}</td>
              <td>
                <div className="flex gap-2 w-full items-center justify-center">
                  <Link
                    to={`/registrasi/form/${item.id}`}
                    className="p-1.5 bg-cyan-500 hover:bg-cyan-400 text-white aspect-square rounded-md flex items-center justify-center outline-none relative group"
                  >
                    <HOutline.ArrowRightIcon className="size-6" />
                    <span className="absolute text-nowrap mb-2 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all group-hover:block bg-gray-800 text-white text-sm rounded-md px-2 py-1 shadow-lg top-full z-10">
                      Registrasi
                    </span>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-end">
        {pasiens.links.map((link, k) => (
          <button
            key={k}
            type="button"
            className={clsx(
              "border flex items-center px-3 py-1.5",
              "border-blue-600",
              link.url === null
                ? "bg-slate-200"
                : link.active
                ? "cursor-pointer bg-blue-600 text-white"
                : "cursor-pointer bg-white text-blue-600 hover:bg-slate-300"
            )}
          >
            <span dangerouslySetInnerHTML={{ __html: link.label }} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListPasien;

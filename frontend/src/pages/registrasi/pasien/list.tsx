import { FC, useEffect, useState } from "react";
import { Link } from "react-router";
import * as HOutline from "@heroicons/react/24/outline";
import { api, ResponseT } from "../../../utils/api";
import { PaginateT } from "../../../utils/paginate";
import { PasienT } from "./types";

const ListPasien: FC = () => {
  const [pasiens, setPasiens] = useState<PaginateT<PasienT[]>>({
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
    to: 1,
    total: 1,
  });

  const getPasiens = async () => {
    try {
      const response = await api.get<ResponseT<PaginateT<PasienT[]>>>(
        "/pasien/get-pasien"
      );

      if (response.data.data) {
        setPasiens(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {
      getPasiens();
    };
  }, []);
  return (
    <div className="bg-white shadow-lg p-6 rounded-md mb-6 grid gap-4 auto-rows-min">
      <div className="flex w-1/2 items-center gap-2">
        <input
          type="text"
          placeholder="No RM, NIK, Nama Pasien"
          className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300 w-full"
        />

        <button className="py-1.5 px-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-md flex items-center justify-center outline-none text-nowrap h-full gap-2">
          <HOutline.MagnifyingGlassIcon className="size-6" />
          <span>Cari</span>
        </button>
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
    </div>
  );
};

export default ListPasien;

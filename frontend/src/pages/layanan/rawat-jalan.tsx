import clsx from "clsx";
import { FC } from "react";
import * as HOutline from "@heroicons/react/24/outline";
import Select from "react-select";
import { styles } from "../../utils/react-select";
import { options } from "../../mock/react-select";

const RawatJalan: FC = () => {
  return (
    <div className="bg-white shadow-lg p-6 rounded-md mb-6 grid gap-4 auto-rows-min">
      <div className="grid grid-cols-4 gap-3">
        <div className="h-full flex items-center">
          <span className="font-medium">Rawat Jalan</span>
        </div>

        <div className="flex items-center gap-1">
          <input
            type="date"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300 w-full"
          />
          <span>s/d</span>
          <input
            type="date"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300 w-full"
          />
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
          options={options}
        />

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="No RM, NIK, Nama Pasien"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300 w-full"
          />

          <button
            onClick={async () => {}}
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
            <th>Nama</th>
            <th>Statu Pulang</th>
            <th>Waiting</th>
            <th>Status</th>
            <th>M.Records</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 15 }, (_, k) => (
            <tr key={k}>
              <td>
                <div className="size-8 bg-green-200 text-green-600 flex items-center justify-center rounded-full">
                  {k}
                </div>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <div className="size-8 bg-blue-200 text-blue-600 flex items-center justify-center rounded-full">
                    {k % 2 === 0 ? "L" : "P"}
                  </div>
                  <span>Nama</span>
                </div>
              </td>
              <td>Berobat Jalan</td>
              <td>
                <span className="text-sm bg-gray-500 text-white px-4 py-1 rounded-sm">
                  13:20
                </span>
              </td>
              <td>
                <div className="flex bg-slate-500 text-white mx-auto rounded-full px-1.5 py-0.5 justify-between items-center max-w-36">
                  <span className="text-sm">Selesai</span>
                  <span
                    className={clsx(
                      "w-4 h-4 block rounded-full",
                      "bg-red-600"
                      // {
                      //   "bg-red-600": item.status === "Belum Dilayani",
                      //   "bg-yellow-600": item.status === "Dilayani",
                      //   "bg-green-600": item.status === "Selesai",
                      //   "bg-black": item.status === "Pulang",
                      // }
                    )}
                  ></span>
                </div>
              </td>
              <td>
                <div className="rounded-md overflow-hidden flex items-center mx-auto h-10 w-max">
                  <button
                    type="button"
                    className="bg-green-600 hover:bg-green-500 text-white px-3 h-full"
                  >
                    M.Records
                  </button>
                  <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 h-full flex items-center justify-center"
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

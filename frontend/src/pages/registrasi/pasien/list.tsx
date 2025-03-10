import { FC } from "react";
import { Link } from "react-router";
import * as HOutline from "@heroicons/react/24/outline";

const pasiens: {
  nama: string;
  nik: string;
  tgl_lahir: string;
  no_rm: string;
  no_bpjs: string;
}[] = [
  {
    nama: "Ahmad Fauzi",
    nik: "3174091201990001",
    tgl_lahir: "1990-01-12",
    no_rm: "RM001",
    no_bpjs: "BPJS1234567890",
  },
  {
    nama: "Siti Nurhaliza",
    nik: "3174091501980002",
    tgl_lahir: "1988-05-15",
    no_rm: "RM002",
    no_bpjs: "BPJS0987654321",
  },
  {
    nama: "Budi Santoso",
    nik: "3174092301970003",
    tgl_lahir: "1997-03-23",
    no_rm: "RM003",
    no_bpjs: "BPJS1122334455",
  },
  {
    nama: "Dewi Anggraini",
    nik: "3174091101990004",
    tgl_lahir: "1999-11-10",
    no_rm: "RM004",
    no_bpjs: "BPJS5566778899",
  },
  {
    nama: "Rudi Hartono",
    nik: "3174090801980005",
    tgl_lahir: "1985-08-08",
    no_rm: "RM005",
    no_bpjs: "BPJS6677889900",
  },
  {
    nama: "Intan Permatasari",
    nik: "3174092502000006",
    tgl_lahir: "2000-02-25",
    no_rm: "RM006",
    no_bpjs: "BPJS4455667788",
  },
  {
    nama: "Agus Riyanto",
    nik: "3174093001970007",
    tgl_lahir: "1997-03-30",
    no_rm: "RM007",
    no_bpjs: "BPJS2233445566",
  },
  {
    nama: "Lina Marlina",
    nik: "3174090901980008",
    tgl_lahir: "1989-09-09",
    no_rm: "RM008",
    no_bpjs: "BPJS3344556677",
  },
  {
    nama: "Hendra Kurniawan",
    nik: "3174091401960009",
    tgl_lahir: "1996-04-14",
    no_rm: "RM009",
    no_bpjs: "BPJS7788990011",
  },
  {
    nama: "Nadia Kusuma",
    nik: "3174090701950010",
    tgl_lahir: "1995-07-07",
    no_rm: "RM010",
    no_bpjs: "BPJS8899001122",
  },
];

const ListPasien: FC = () => {
  return (
    <div className="bg-white shadow-lg p-6 rounded-md mb-6 grid gap-4 auto-rows-min">
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
          {pasiens.map((item, key) => (
            <tr key={key}>
              <td>{key + 1}</td>
              <td>{item.nama}</td>
              <td>{item.nik}</td>
              <td>{item.tgl_lahir}</td>
              <td>{item.no_rm}</td>
              <td>{item.no_bpjs}</td>
              <td>
                <div className="flex gap-2 w-full items-center justify-center">
                  <Link
                    to={`/registrasi/form/${key}`}
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

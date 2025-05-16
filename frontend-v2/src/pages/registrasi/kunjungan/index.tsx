import Spinner from "@/components/spinner";
import { AddButton, SearchField } from "@/components/table";
import { Paginate, PasienObject, XHRStatus } from "@/utils/global-types";
import paginate from "@/utils/paginate";
import {
  IconChevronLeft,
  IconChevronRight,
  IconExclamationCircle,
  IconPencil,
} from "@tabler/icons-react";
import { FC, JSX, useEffect, useState } from "react";
import service from "./service";
import { useSelector } from "react-redux";
import { AppState } from "@/utils/state";

const Kunjungan: FC = () => {
  const token = useSelector((state: AppState) => state.token);
  const [data, setData] = useState<Paginate<PasienObject[]>>(paginate.init());
  const [xhrStatus, setXhrStatus] = useState<XHRStatus>("loading");

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

  useEffect(() => {
    preload();
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="bg-white rounded-md overflow-hidden flex flex-col">
        <div className="p-5 flex items-center justify-between">
          <span className="font-medium text-xl">Base URL</span>
          <div className="flex items-center gap-2.5">
            <SearchField />
            <AddButton onClick={() => {}} />
          </div>
        </div>
        <div className="max-h-[70vh] overflow-y-scroll">
          <table className="w-full sticky-header-table text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Nama</th>
                <th>NIK</th>
                <th>Tgl Lahir</th>
                <th>No RM</th>
                <th>No BPJS</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {
                (
                  {
                    error: (
                      <tr>
                        <td colSpan={7} className="text-center">
                          <div className="flex items-center justify-center gap-2.5">
                            <IconExclamationCircle className="size-6" />
                            <span>Error loading data</span>
                          </div>
                        </td>
                      </tr>
                    ),
                    loading: (
                      <tr>
                        <td colSpan={7} className="text-center">
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
                          <td colSpan={7} className="text-center">
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
                            <td>{item.nama}</td>
                            <td>{item.nik}</td>
                            <td>{item.tanggal_lahir}</td>
                            <td>{item.norm}</td>
                            <td>{item.no_bpjs}</td>
                            <td>
                              <button
                                type="button"
                                className="cursor-pointer text-white bg-indigo-700 hover:bg-indigo-500 hover:scale-110 transition-all duration-300 rounded-sm p-2.5"
                                onClick={() => {}}
                              >
                                <IconPencil className="size-6" />
                              </button>
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
  );
};

export default Kunjungan;

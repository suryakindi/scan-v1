import {
  IconChevronLeft,
  IconChevronRight,
  IconPencil,
} from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import service from "./service";
import { useSelector } from "react-redux";
import { AppState } from "@/utils/state";
import { BaseURLObject, XHRStatus } from "@/utils/global-types";
import { ClipLoader } from "react-spinners";

const BaseURL: FC = () => {
  const token = useSelector((state: AppState) => state.token);
  const [data, setData] = useState<BaseURLObject[]>([]);
  const [xhrStatus, setXhrStatus] = useState<XHRStatus>("loading");

  useEffect(() => {
    service.getData(token).then(({ data }) => {
      if (data.data) {
        setData(data.data);
      }
    });
  }, [token]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="bg-white rounded-md overflow-hidden flex flex-col">
        <div className="p-5">
          <span className="font-medium text-xl">Base URL</span>
        </div>
        <div className="max-h-[70vh] overflow-y-scroll">
          <table className="w-full sticky-header-table text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Base URL</th>
                <th>Kode Aplikasi</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {(["loading", "error"] as XHRStatus[]).includes(xhrStatus) && (
                <tr>
                  <td colSpan={4} className="text-center">
                    <div className="flex items-center justify-center gap-2.5">
                      <ClipLoader loading={xhrStatus === "loading"} size={12} />
                      {xhrStatus === "loading" ? (
                        <span>Loading...</span>
                      ) : (
                        <span>Error loading data</span>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {data.map((item, k) => (
                <tr key={k}>
                  <td>{k + 1}</td>
                  <td>{item.base_url}</td>
                  <td>{item.kdAplikasi}</td>
                  <td>
                    <button
                      type="button"
                      className="cursor-pointer text-white bg-indigo-700 hover:bg-indigo-500 hover:scale-110 transition-all duration-300 rounded-sm p-2.5"
                    >
                      <IconPencil className="size-5" />
                    </button>
                  </td>
                </tr>
              ))}
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

export default BaseURL;

import { FC, FormEventHandler, useEffect, useRef, useState } from "react";
import * as HOutline from "@heroicons/react/24/outline";
import Select from "react-select";
import {
  cast,
  findValue,
  mapOptions,
  styles,
} from "../../../utils/react-select";
import { options } from "../../../mock/react-select";
import { Alert, Toast } from "../../../utils/alert";
import { Stage, Layer, Line, Image } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import clsx from "clsx";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { api, ResponseT, useXState } from "../../../utils/api";
import { Link, useLoaderData, useParams } from "react-router";
import { LoaderT, UserT } from "../../../user";
import moment from "moment";

const SOAP: FC = () => {
  const { user } = useLoaderData<LoaderT>();
  const param = useParams();

  type Data = {
    id_pasien: number;
    nik_pasien: string | null;
    nama: string;
    no_bpjs: string;
    nama_ruangan: string;
    dokter: string | null;
    noantrian: string;
    id_registrasi_pasiens: number;
    no_registrasi_pasien: string;
    id_registrasi_detail_layanan_pasiens: number;
    id_vital_signs: number | null;
    tanggal_masuk: string;
    tanggal_lahir: string;
  };

  type VitalSign = {
    id_vital_signs: number | null;
    id_registrasi_pasien: number;
    no_registrasi: string;
    tekanan_darah_hh: string | null;
    tekanan_darah_mg: string | null;
    temperature: string | null;
    nadi: string | null;
    pernafasan: string | null;
    berat_badan: string | null;
    tinggi_badan: string | null;
    lingkar_kepala: string | null;
    lingkar_perut: string | null;
    lingkar_lengan: string | null;
    cara_ukur: "Berbaring" | "Berdiri" | null;
    kesadaran: number | null;
  };

  type SaveResponseVitalSign = VitalSign;

  const [vitalSign, setVitalSign, vitalSignFn] = useXState<
    VitalSign,
    SaveResponseVitalSign
  >(
    {
      id_vital_signs: null,
      id_registrasi_pasien: 0,
      no_registrasi: "",
      tekanan_darah_hh: "",
      tekanan_darah_mg: "",
      temperature: "",
      nadi: "",
      pernafasan: "",
      berat_badan: "",
      tinggi_badan: "",
      lingkar_kepala: "",
      lingkar_perut: "",
      lingkar_lengan: "",
      cara_ukur: "Berdiri",
      kesadaran: null,
    },
    { method: "POST", url: "/layanan/save-vital-sign" }
  );

  const handleSaveVitalSign: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await vitalSignFn.submit();
      await getPasienById();

      Toast.fire({
        title: "Berhasil",
        text: "Berhasil menyimpan vital sign",
        icon: "success",
      });
    } catch (error) {
      Toast.fire({
        title: "Error",
        text: "Gagal menyimpan vital sign",
        icon: "error",
      });
      console.error(error);
    }
  };

  const getVitalSignById = async (id_vital_signs: number) => {
    try {
      const response = await api.get<ResponseT<VitalSign>>(
        `/layanan/get-vital-sign-by-id/${id_vital_signs}`
      );
      if (response.data.data) {
        setVitalSign({
          ...response.data.data,
          kesadaran: Number(response.data.data.kesadaran),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [pasien, setPasien] = useState<Data | null>(null);

  const getPasienById = async () => {
    try {
      const response = await api.get<ResponseT<Data>>(
        `/layanan/daftar-pasien/teregistrasi/id/${param.id_registrasi}`
      );

      if (response.data.data) {
        setPasien(response.data.data);
        if (response.data.data.id_vital_signs) {
          await getVitalSignById(response.data.data.id_vital_signs);
        } else {
          setVitalSign({
            id_vital_signs: response.data.data.id_vital_signs,
            id_registrasi_pasien: response.data.data.id_registrasi_pasiens,
            no_registrasi: response.data.data.no_registrasi_pasien,
          });
        }

        await getSoapByIdRegistrasi(
          response.data.data.id_registrasi_detail_layanan_pasiens
        );

        await getGambarMRecordByIdRegistrasi(
          response.data.data.id_registrasi_detail_layanan_pasiens
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  type soapT = {
    datetime: string;
    user_id: number | null;
    S: string;
    O: string;
    A: string;
    P: string;
  };

  const [listUsers, setListUsers] = useState<UserT[]>([]);

  const getListUsers = async () => {
    try {
      const response = await api.get<ResponseT<UserT[]>>(
        `/layanan/get-user/${user.cdfix}`
      );

      if (response.data.data) {
        setListUsers(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  type Kesadaran = {
    id: number;
    kesadaran: string;
    kodeexternal: string;
    is_active: boolean;
    cdfix: number;
    created_by: number;
    updated_by: string | null;
    deleted_by: string | null;
    deleted_at: string | null;
    created_at: string | null;
    updated_at: string | null;
  };

  const [kesadarans, setKesadarans] = useState<Kesadaran[]>([]);

  const getKesadaran = async () => {
    try {
      const response = await api.get<ResponseT<Kesadaran[]>>(
        "/layanan/get-kesadaran"
      );

      if (response.data.data) setKesadarans(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const [soapDetails, setSoapDetails] = useState<soapT[]>([]);

  const handleTambahSOAP = () => {
    const userFinded = findValue(listUsers, { id: user.id });

    setSoapDetails((prev) => [
      ...prev,
      {
        S: "",
        O: "",
        A: "",
        P: "",
        user_id: userFinded ? Number(userFinded.id) : null,
        datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
      },
    ]);
  };

  const handleChangeSOAP = (
    index: number,
    key: keyof soapT,
    value: soapT[typeof key]
  ) => {
    setSoapDetails((prev) =>
      prev.map((soap, i) => (i === index ? { ...soap, [key]: value } : soap))
    );
  };

  const handleDeleteSOAP = (index: number) => {
    setSoapDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitSOAP: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      if (!pasien)
        Toast.fire({
          title: "Gagal",
          text: "Data registrasi tidak ditemukan",
          icon: "error",
        });

      try {
        await api.post("/layanan/save-soap", {
          id_registrasi_detail_layanan_pasiens:
            pasien?.id_registrasi_detail_layanan_pasiens,
          soap_details: soapDetails,
        });
      } catch {}

      try {
        await getSoapByIdRegistrasi(
          pasien?.id_registrasi_detail_layanan_pasiens ?? 0
        );
      } catch {}

      try {
        await getGambarMRecordByIdRegistrasi(
          pasien?.id_registrasi_detail_layanan_pasiens ?? 0
        );
      } catch {}

      Toast.fire({
        title: "Berhasil",
        text: "Lorem ipsum dolor sit amet.",
        icon: "success",
      });
    } catch (error) {
      console.error(error);
      Toast.fire({
        title: "Gagal",
        text: "Lorem ipsum dolor sit amet.",
        icon: "error",
      });
    }
  };

  const getSoapByIdRegistrasi = async (registrasiId: number | string) => {
    try {
      const response = await api.get<
        ResponseT<{
          id: number;
          cdfix: number;
          id_registrasi_detail_layanan_pasien: number;
          soap_details: soapT[];
          is_active: boolean;
          created_by: number | null;
          updated_by: number | null;
          deleted_by: number | null;
          deleted_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        }>
      >(`/layanan/get-soap-by-id-registrasi/${registrasiId}`);

      if (response.data.data.soap_details)
        setSoapDetails(response.data.data.soap_details);
    } catch (error) {
      console.error(error);
    }
  };

  type GambarMRecordResponse = {
    id: number;
    id_registrasi_detail_layanan_pasien: number;
    gambar: string;
    cdfix: number;
    is_active: boolean;
    created_by: number | null;
    updated_by: number | null;
    deleted_by: number | null;
    created_at: string | null;
    updated_at: string | null;
  };

  const getGambarMRecordByIdRegistrasi = async (
    registrasiId: number | string
  ) => {
    try {
      const response = await api.get<ResponseT<GambarMRecordResponse>>(
        `/layanan/get-gambar-m-record/${registrasiId}`
      );

      if (response.data.data.gambar)
        setDrawLines(JSON.parse(response.data.data.gambar));
    } catch (error) {
      console.error(error);
    }
  };

  const saveGambarMRecordByIdRegistrasi = async () => {
    try {
      await api.post<ResponseT<GambarMRecordResponse>>(
        "/layanan/save-gambar-m-record/",
        {
          id_registrasi_detail_layanan_pasien: param.id_registrasi,
          gambar: JSON.stringify(drawLines),
        }
      );

      Alert.fire({
        title: "Berhasil",
        text: "Berhasil menyimpan gambar",
        icon: "success",
      });
    } catch (error) {
      Alert.fire({
        title: "Error",
        text: "Gagal menyimpan gambar",
        icon: "error",
      });
      console.error(error);
    }
  };

  useEffect(() => {
    getListUsers();
    getPasienById();
    getKesadaran();
  }, []);

  /**
   * drawing
   */
  const drawContainerRef = useRef<HTMLDivElement>(null);
  const [drawLines, setDrawLines] = useState<
    { tool: string; points: number[] }[]
  >([]);
  const isDrawing = useRef<boolean>(false);
  const [drawImage, setDrawImage] = useState<HTMLImageElement | null>(null);
  const [drawDimensions, setDrawDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const img = new window.Image();
    img.src = "/images/anatomi.png";
    img.onload = () => {
      setDrawImage(img);
      updateSize(img);
    };

    const updateSize = (img: HTMLImageElement) => {
      if (drawContainerRef.current) {
        const containerWidth = drawContainerRef.current.clientWidth;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const newWidth = containerWidth;
        const newHeight = newWidth / aspectRatio;

        setDrawDimensions({ width: newWidth, height: newHeight });
      }
    };

    const handleResize = () => {
      if (drawImage) {
        updateSize(drawImage);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const pos = e.currentTarget.getStage()?.getPointerPosition();
    if (pos) {
      setDrawLines((prevLines) => [
        ...prevLines,
        { tool: "pen", points: [pos.x, pos.y] },
      ]);
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) return;
    const stage = e.currentTarget.getStage();
    const point = stage?.getPointerPosition();

    if (point) {
      setDrawLines((prevLines) => {
        const lastLine = prevLines[prevLines.length - 1];
        if (!lastLine) return prevLines;

        const updatedLine = {
          ...lastLine,
          points: [...lastLine.points, point?.x, point?.y],
        };
        return [...prevLines.slice(0, -1), updatedLine];
      });
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleResetDrawing = () => {
    setDrawLines([]);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {pasien && (
        <div className="bg-white shadow-lg p-6 rounded-md items-center grid grid-cols-1 gap-6">
          <div className="flex justify-between">
            <div className="flex">
              <div className="size-28 aspect-square">
                <img src="/images/userL.png" alt="user.." />
              </div>
              <div className="flex flex-col justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-medium">
                    {pasien.nama} (
                    {`${moment().diff(
                      moment(pasien.tanggal_lahir, "YYYY-MM-DD"),
                      "years"
                    )}th`}
                    )
                  </span>
                  <span>
                    NIK: {pasien.nik_pasien} /{" "}
                    {pasien.no_bpjs && <>BPJS: {pasien.no_bpjs}</>}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Link
                    to={`/registrasi/details/${pasien.id_pasien}`}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer rounded-sm flex items-center justify-between outline-0"
                  >
                    Details
                  </Link>

                  <button
                    type="button"
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white cursor-pointer rounded-sm flex items-center justify-between outline-0"
                  >
                    JKN
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 border border-green-600 hover:bg-slate-200 text-green-600 cursor-pointer rounded-sm flex items-center justify-between outline-0"
                  >
                    iCare
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              <div className="flex flex-col items-end">
                <span className="text-3xl font-medium">{pasien.noantrian}</span>
                <span className="text-xl font-medium">
                  {pasien.nama_ruangan}
                </span>
              </div>
              {pasien.dokter ? (
                <span className="text-sm">{pasien.dokter}</span>
              ) : (
                <i className="text-red-600 italic">
                  Belum ada dokter menulis SOAP
                </i>
              )}
              <span className="text-sm">
                {moment(pasien.tanggal_masuk)
                  .locale("id")
                  .format("D MMMM YYYY")}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 auto-rows-min">
        <div className="flex flex-col">
          <div className="grid grid-cols-1 gap-6">
            <div className="px-6">
              <div
                ref={drawContainerRef}
                className="flex flex-col items-center gap-6"
              >
                <span className="text-xs">
                  Drag cursor untuk menggambar marker pada area bermasalah
                </span>
                <Stage
                  width={drawDimensions.width}
                  height={drawDimensions.height}
                  onMouseDown={handleMouseDown}
                  onMousemove={handleMouseMove}
                  onMouseup={handleMouseUp}
                >
                  <Layer>
                    {drawImage && (
                      <Image
                        image={drawImage}
                        width={drawDimensions.width}
                        height={drawDimensions.height}
                      />
                    )}
                  </Layer>
                  <Layer>
                    {drawLines.map((line, i) => (
                      <Line
                        key={i}
                        points={line.points}
                        stroke="#000000"
                        strokeWidth={3}
                        tension={0.5}
                        lineCap="round"
                        lineJoin="round"
                        globalCompositeOperation="source-over"
                      />
                    ))}
                  </Layer>
                </Stage>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-blue-600 hover:bg-slate-200 text-blue-600 cursor-pointer rounded-sm flex items-center justify-between outline-0"
                    onClick={handleResetDrawing}
                  >
                    Undo
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 border border-blue-600 hover:bg-blue-500 text-white bg-blue-600 cursor-pointer rounded-sm flex items-center justify-between outline-0"
                    onClick={saveGambarMRecordByIdRegistrasi}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-center border-b border-b-slate-300 p-6">
              <span className="text-5xl text-nowrap">
                {vitalSign.tekanan_darah_hh === ""
                  ? "0"
                  : vitalSign.tekanan_darah_hh}
                /
                {vitalSign.tekanan_darah_mg === ""
                  ? "0"
                  : vitalSign.tekanan_darah_mg}{" "}
                mmHg
              </span>
            </div>
            <div className="grid grid-cols-3 items-center">
              <div className="flex items-center justify-center gap-2">
                <img
                  src="/images/temperature.png"
                  alt="temperature..."
                  className="size-10"
                />
                <span className="text-xl">
                  {vitalSign.temperature === "" ? "0" : vitalSign.temperature}{" "}
                  &#176;C
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <img
                  src="/images/heart.png"
                  alt="temperature..."
                  className="size-10"
                />
                <span className="text-xl">
                  {vitalSign.nadi === "" ? "0" : vitalSign.nadi} x
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <img
                  src="/images/lungs.png"
                  alt="temperature..."
                  className="size-10"
                />
                <span className="text-xl">
                  {vitalSign.pernafasan === "" ? "0" : vitalSign.pernafasan} x
                </span>
              </div>
            </div>

            <form
              onSubmit={handleSaveVitalSign}
              className="flex flex-col gap-6"
            >
              <div className="bg-white shadow-lg rounded-md p-6 gap-6 flex flex-col">
                <span className="text-xl font-medium">Kesadaran</span>
                <Select
                  className="w-full"
                  isClearable={true}
                  isSearchable={true}
                  styles={styles}
                  placeholder="Pilih..."
                  menuPlacement="bottom"
                  required={true}
                  options={mapOptions(kesadarans, { l: "kesadaran", v: "id" })}
                  value={findValue(
                    kesadarans,
                    {
                      id: vitalSign.kesadaran ?? undefined,
                    },
                    { label: "kesadaran", value: "id" }
                  )}
                  onChange={(e) =>
                    cast<{ label: string; value: number }>(e, ({ value }) => {
                      setVitalSign({ kesadaran: value });
                    })
                  }
                />
              </div>

              <div className="bg-white shadow-lg rounded-md p-6 gap-6 flex flex-col">
                <div className="gap-3 flex flex-col">
                  <span className="text-xl font-medium">Vital sign</span>
                  <div className="grid grid-cols-3 items-center">
                    <span className="col-span-1">Tekanan darah</span>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          className="border border-gray-300 py-1.5 px-2 w-2/5 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                          value={vitalSign.tekanan_darah_hh ?? ""}
                          onChange={({ currentTarget: { value } }) =>
                            setVitalSign({ tekanan_darah_hh: value })
                          }
                        />
                        <span>/</span>
                        <div className="flex items-center border border-gray-300 w-3/5 rounded-sm focus-within:border-blue-300 active:border-blue-300">
                          <input
                            type="number"
                            className="py-1.5 px-2 w-full outline-none"
                            value={vitalSign.tekanan_darah_mg ?? ""}
                            onChange={({ currentTarget: { value } }) =>
                              setVitalSign({ tekanan_darah_mg: value })
                            }
                          />
                          <span className="mx-2">mmHg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <label htmlFor="temperature" className="col-span-1">
                      Temperature
                    </label>
                    <div className="col-span-2">
                      <div className="flex items-center border border-gray-300 rounded-sm focus-within:border-blue-300 active:border-blue-300">
                        <input
                          type="number"
                          id="temperature"
                          className="py-1.5 px-2 w-full outline-none"
                          value={vitalSign.temperature ?? ""}
                          onChange={({ currentTarget: { value } }) =>
                            setVitalSign({ temperature: value })
                          }
                        />
                        <span className="mx-2">&#176;C</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <label htmlFor="nadi" className="col-span-1">
                      Nadi
                    </label>
                    <div className="col-span-2">
                      <div className="flex items-center border border-gray-300 rounded-sm focus-within:border-blue-300 active:border-blue-300">
                        <input
                          type="number"
                          id="nadi"
                          className="py-1.5 px-2 w-full outline-none"
                          value={vitalSign.nadi ?? ""}
                          onChange={({ currentTarget: { value } }) =>
                            setVitalSign({ nadi: value })
                          }
                        />
                        <span className="mx-2">x/menit</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <label htmlFor="pernafasan" className="col-span-1">
                      Pernafasan
                    </label>
                    <div className="col-span-2">
                      <div className="flex items-center border border-gray-300 rounded-sm focus-within:border-blue-300 active:border-blue-300">
                        <input
                          type="number"
                          id="pernafasan"
                          className="py-1.5 px-2 w-full outline-none"
                          value={vitalSign.pernafasan ?? ""}
                          onChange={({ currentTarget: { value } }) =>
                            setVitalSign({ pernafasan: value })
                          }
                        />
                        <span className="mx-2">x/menit</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <label htmlFor="berat-badan" className="col-span-1">
                      Berat Badan
                    </label>
                    <div className="col-span-2">
                      <div className="flex items-center border border-gray-300 rounded-sm focus-within:border-blue-300 active:border-blue-300">
                        <input
                          type="number"
                          id="berat-badan"
                          className="py-1.5 px-2 w-full outline-none"
                          value={vitalSign.berat_badan ?? ""}
                          onChange={({ currentTarget: { value } }) =>
                            setVitalSign({ berat_badan: value })
                          }
                        />
                        <span className="mx-2">Kg</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <label htmlFor="tinggi-badan" className="col-span-1">
                      Tinggi Badan
                    </label>
                    <div className="col-span-2">
                      <div className="flex items-center border border-gray-300 rounded-sm focus-within:border-blue-300 active:border-blue-300">
                        <input
                          type="number"
                          id="tinggi-badan"
                          className="py-1.5 px-2 w-full outline-none"
                          value={vitalSign.tinggi_badan ?? ""}
                          onChange={({ currentTarget: { value } }) =>
                            setVitalSign({ tinggi_badan: value })
                          }
                        />
                        <span className="mx-2">Cm</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <label htmlFor="lingkar-kepala" className="col-span-1">
                      Lingkar Kepala
                    </label>
                    <div className="col-span-2">
                      <div className="flex items-center border border-gray-300 rounded-sm focus-within:border-blue-300 active:border-blue-300">
                        <input
                          type="number"
                          id="lingkar-kepala"
                          className="py-1.5 px-2 w-full outline-none"
                          value={vitalSign.lingkar_kepala ?? ""}
                          onChange={({ currentTarget: { value } }) =>
                            setVitalSign({ lingkar_kepala: value })
                          }
                        />
                        <span className="mx-2">Cm</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <label htmlFor="lingkar-perut" className="col-span-1">
                      Lingkar Perut
                    </label>
                    <div className="col-span-2">
                      <div className="flex items-center border border-gray-300 rounded-sm focus-within:border-blue-300 active:border-blue-300">
                        <input
                          type="number"
                          id="lingkar-perut"
                          className="py-1.5 px-2 w-full outline-none"
                          value={vitalSign.lingkar_perut ?? ""}
                          onChange={({ currentTarget: { value } }) =>
                            setVitalSign({ lingkar_perut: value })
                          }
                        />
                        <span className="mx-2">Cm</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <label htmlFor="lingkar-lengan" className="col-span-1">
                      Lingkar Lengan
                    </label>
                    <div className="col-span-2">
                      <div className="flex items-center border border-gray-300 rounded-sm focus-within:border-blue-300 active:border-blue-300">
                        <input
                          type="number"
                          id="lingkar-lengan"
                          className="py-1.5 px-2 w-full outline-none"
                          value={vitalSign.lingkar_lengan ?? ""}
                          onChange={({ currentTarget: { value } }) =>
                            setVitalSign({ lingkar_lengan: value })
                          }
                        />
                        <span className="mx-2">Cm</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <span className="col-span-1">Cara ukur</span>
                    <div className="col-span-2">
                      <div className="flex items-center text-nowrap">
                        <button
                          type="button"
                          className={clsx(
                            vitalSign.cara_ukur === "Berbaring"
                              ? "text-white bg-blue-600 hover:bg-blue-500"
                              : "text-blue-600 hover:text-blue-500 hover:bg-blue-100/30",
                            "flex w-full justify-center items-center px-3 py-1.5 border border-e-0 rounded-s-sm cursor-pointer border-blue-600"
                          )}
                          onClick={() =>
                            setVitalSign({ cara_ukur: "Berbaring" })
                          }
                        >
                          Berbaring
                        </button>
                        <button
                          type="button"
                          className={clsx(
                            vitalSign.cara_ukur === "Berdiri"
                              ? "text-white bg-blue-600 hover:bg-blue-500"
                              : "text-blue-600 hover:text-blue-500 hover:bg-blue-100/30",
                            "flex w-full justify-center items-center px-3 py-1.5 border border-s-0 rounded-e-sm cursor-pointer border-blue-600"
                          )}
                          onClick={() => setVitalSign({ cara_ukur: "Berdiri" })}
                        >
                          Berdiri
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white cursor-pointer rounded-sm ml-auto flex items-center justify-between outline-0"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <TabGroup>
          <TabList>
            <Tab className="mr-2 cursor-pointer outline-none rounded-sm px-4 py-2 data-[selected]:text-white data-[selected]:bg-gray-600 data-[selected]:font-semibold data-[hover]:bg-gray-300">
              SOAP
            </Tab>
            <Tab className="mr-2 cursor-pointer outline-none rounded-sm px-4 py-2 data-[selected]:text-white data-[selected]:bg-gray-600 data-[selected]:font-semibold data-[hover]:bg-gray-300">
              Tindakan
            </Tab>
          </TabList>
          <TabPanels className="mt-4">
            {/* SOAP TAB */}
            <TabPanel>
              <form className="flex flex-col gap-6" onSubmit={handleSubmitSOAP}>
                <div className="bg-white shadow-lg p-6 rounded-md items-center grid grid-cols-1 gap-6">
                  {soapDetails.length > 0 && (
                    <div className="grid grid-cols-1 gap-12">
                      {soapDetails.map((soap, k) => (
                        <div
                          key={k}
                          className="border border-gray-300 grid grid-cols-1 p-3 rounded-sm gap-3"
                        >
                          <div className="flex flex-1 gap-3">
                            <div className="flex flex-1 gap-3">
                              <div className="flex flex-1">
                                <Select
                                  className="w-full"
                                  isClearable={true}
                                  isSearchable={true}
                                  styles={styles}
                                  placeholder="Pilih..."
                                  menuPlacement="bottom"
                                  required={true}
                                  isDisabled={true}
                                  options={mapOptions(listUsers, {
                                    l: "name",
                                    v: "id",
                                  })}
                                  value={findValue(
                                    listUsers,
                                    { id: soap.user_id ?? undefined },
                                    { label: "name", value: "id" }
                                  )}
                                  onChange={(e) =>
                                    cast<{
                                      label: string;
                                      value: number;
                                    } | null>(e, (selected) => {
                                      handleChangeSOAP(
                                        k,
                                        "user_id",
                                        selected?.value ?? null
                                      );
                                    })
                                  }
                                />
                              </div>
                              <div className="flex flex-1">
                                <input
                                  type="datetime-local"
                                  className={clsx(
                                    "w-full border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300",
                                    "disabled:bg-gray-200/80 disabled:active:border-gray-300 disabled:focus:border-gray-300",
                                    "read-only:bg-gray-200/80 read-only:active:border-gray-300 read-only:focus:border-gray-300"
                                  )}
                                  required={true}
                                  value={soap.datetime}
                                  readOnly={true}
                                  onChange={({ currentTarget: { value } }) =>
                                    handleChangeSOAP(k, "datetime", value)
                                  }
                                />
                              </div>
                            </div>

                            {user.id === soap.user_id && (
                              <button
                                type="button"
                                className="bg-red-600 hover:bg-red-500 text-white cursor-pointer rounded-sm ml-auto flex items-center justify-center h-[38px] aspect-square outline-0"
                                onClick={() => handleDeleteSOAP(k)}
                              >
                                <HOutline.TrashIcon className="size-5" />
                              </button>
                            )}
                          </div>
                          <div className="flex gap-3">
                            <div className="flex items-center w-4">
                              <span>S</span>
                            </div>
                            <div className="flex flex-1">
                              <textarea
                                className={clsx(
                                  "w-full border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300",
                                  "disabled:bg-gray-200/80 disabled:active:border-gray-300 disabled:focus:border-gray-300",
                                  "read-only:bg-gray-200/80 read-only:active:border-gray-300 read-only:focus:border-gray-300"
                                )}
                                required={true}
                                value={soap.S}
                                onChange={({ currentTarget: { value } }) =>
                                  handleChangeSOAP(k, "S", value)
                                }
                                disabled={user.id !== soap.user_id}
                              ></textarea>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex items-center w-4">
                              <span>O</span>
                            </div>
                            <div className="flex flex-1">
                              <textarea
                                className={clsx(
                                  "w-full border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300",
                                  "disabled:bg-gray-200/80 disabled:active:border-gray-300 disabled:focus:border-gray-300",
                                  "read-only:bg-gray-200/80 read-only:active:border-gray-300 read-only:focus:border-gray-300"
                                )}
                                required={true}
                                value={soap.O}
                                onChange={({ currentTarget: { value } }) =>
                                  handleChangeSOAP(k, "O", value)
                                }
                                disabled={user.id !== soap.user_id}
                              ></textarea>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex items-center w-4">
                              <span>A</span>
                            </div>
                            <div className="flex flex-1">
                              <textarea
                                className={clsx(
                                  "w-full border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300",
                                  "disabled:bg-gray-200/80 disabled:active:border-gray-300 disabled:focus:border-gray-300",
                                  "read-only:bg-gray-200/80 read-only:active:border-gray-300 read-only:focus:border-gray-300"
                                )}
                                required={true}
                                value={soap.A}
                                onChange={({ currentTarget: { value } }) =>
                                  handleChangeSOAP(k, "A", value)
                                }
                                disabled={user.id !== soap.user_id}
                              ></textarea>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex items-center w-4">
                              <span>P</span>
                            </div>
                            <div className="flex flex-1">
                              <textarea
                                className={clsx(
                                  "w-full border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300",
                                  "disabled:bg-gray-200/80 disabled:active:border-gray-300 disabled:focus:border-gray-300",
                                  "read-only:bg-gray-200/80 read-only:active:border-gray-300 read-only:focus:border-gray-300"
                                )}
                                required={true}
                                value={soap.P}
                                onChange={({ currentTarget: { value } }) =>
                                  handleChangeSOAP(k, "P", value)
                                }
                                disabled={user.id !== soap.user_id}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white cursor-pointer rounded-sm flex items-center justify-between outline-0"
                    >
                      Simpan
                    </button>

                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer rounded-sm flex items-center justify-between outline-0"
                      onClick={handleTambahSOAP}
                    >
                      <HOutline.PlusIcon className="size-5" />
                      <span className="ml-2">Tambah SOAP</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white shadow-lg rounded-md p-6 gap-6 flex flex-col">
                  <span className="text-xl font-medium">Status Gizi</span>
                  <div className="flex items-center justify-between">
                    <span>BMI (Body Mass Index)</span>
                    <span className="text-sm bg-blue-600 text-white px-4 py-1 rounded-sm">
                      23.87
                    </span>
                  </div>
                  <span className="text-xs">Source psgbalita.com</span>
                </div>

                <div className="bg-white shadow-lg rounded-md flex flex-col">
                  <div className="px-6 pt-6 pb-3 gap-6 flex flex-col">
                    <span className="text-xl font-medium">Status Gizi</span>
                    <div className="flex items-center justify-between">
                      <span>BMI (Body Mass Index)</span>
                      <span className="text-sm bg-blue-600 text-white px-4 py-1 rounded-sm">
                        23.87
                      </span>
                    </div>
                  </div>
                  <hr className="border-slate-300" />
                  <div className="px-6 pb-6 pt-3 gap-6 flex flex-col">
                    <div className="flex items-center justify-between">
                      <span>BFA (BMI for Age)</span>
                      <span className="font-medium">Gizi baik (normal)</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      Metode perhitungan umur dalam bulan
                    </span>
                  </div>
                </div>
              </form>
            </TabPanel>

            {/* Tindakan TAB */}
            <TabPanel className="flex flex-col gap-6">
              <div className="bg-white shadow-lg p-6 rounded-md">
                <form
                  className="items-center grid grid-cols-1 gap-6"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="text-center py-6">
                    <span>Tidak ada tindakan</span>
                  </div>
                  <Select
                    className="w-full"
                    isClearable={true}
                    isSearchable={true}
                    styles={styles}
                    placeholder="Pilih..."
                    menuPlacement="bottom"
                    required={true}
                    options={options}
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white cursor-pointer rounded-sm ml-auto flex items-center justify-between outline-0"
                  >
                    Simpan
                  </button>
                </form>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};

export default SOAP;

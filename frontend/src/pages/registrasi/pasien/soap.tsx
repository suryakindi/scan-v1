import { FC, FormEventHandler, useEffect, useRef, useState } from "react";
import * as HOutline from "@heroicons/react/24/outline";
import Select from "react-select";
import { cast, styles } from "../../../utils/react-select";
import { options } from "../../../mock/react-select";
import { Toast } from "../../../utils/alert";
import { Stage, Layer, Line, Image } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import clsx from "clsx";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

const SOAP: FC = () => {
  type soapT = {
    datetime: string;
    dokter: { label: string; value: string } | null;
    S: string;
    O: string;
    A: string;
    P: string;
  };

  const [soaps, setSoaps] = useState<soapT[]>([]);

  const handleTambahSOAP = () => {
    setSoaps((prev) => [
      ...prev,
      { S: "", O: "", A: "", P: "", dokter: null, datetime: "" },
    ]);
  };

  const handleChangeSOAP = (
    index: number,
    key: keyof soapT,
    value: soapT[typeof key]
  ) => {
    setSoaps((prev) =>
      prev.map((soap, i) => (i === index ? { ...soap, [key]: value } : soap))
    );
  };

  const handleDeleteSOAP = (index: number) => {
    setSoaps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitSOAP: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      console.log(soaps);

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
      <div className="bg-white shadow-lg p-6 rounded-md items-center grid grid-cols-1 gap-6">
        <div className="flex justify-between">
          <div className="flex">
            <div className="size-28 aspect-square">
              <img src="/images/userL.png" alt="user.." />
            </div>
            <div className="flex flex-col justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-lg font-medium">
                  BELLA PUSPITA SARI (18th)
                </span>
                <span>0000904097823</span>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer rounded-sm flex items-center justify-between outline-0"
                >
                  Details
                </button>
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
              <span className="text-3xl font-medium">88</span>
              <span className="text-xl font-medium">POLI UMUM</span>
            </div>
            <span className="text-sm">dr. Rio Mandala Putra Ruslan</span>
            <span className="text-sm">Rabu, 26 Maret 2025</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 auto-rows-min">
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
              <button
                type="button"
                className="px-4 py-2 border border-blue-600 hover:bg-slate-200 text-blue-600 cursor-pointer rounded-sm flex items-center justify-between outline-0"
                onClick={handleResetDrawing}
              >
                Undo
              </button>
            </div>
          </div>
          <div className="flex justify-center border-b border-b-slate-300 p-6">
            <span className="text-5xl">132/82 mmHg</span>
          </div>
          <div className="grid grid-cols-3 items-center">
            <div className="flex items-center justify-center gap-2">
              <img
                src="/images/temperature.png"
                alt="temperature..."
                className="size-10"
              />
              <span className="text-xl">36.0 &#176;C</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <img
                src="/images/heart.png"
                alt="temperature..."
                className="size-10"
              />
              <span className="text-xl">82 x</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <img
                src="/images/lungs.png"
                alt="temperature..."
                className="size-10"
              />
              <span className="text-xl">22 x</span>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-md p-6">
            <form
              className="gap-6 flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <span className="text-xl font-medium">Kesadaran</span>
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
              <div className="flex">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white cursor-pointer rounded-sm ml-auto flex items-center justify-between outline-0"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
          <div className="bg-white shadow-lg rounded-md p-6">
            <form
              className="gap-6 flex flex-col"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="gap-3 flex flex-col">
                <span className="text-xl font-medium">Vital sign</span>
                <div className="grid grid-cols-3 items-center">
                  <span className="col-span-1">Tekanan darah</span>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="border border-gray-300 py-1.5 px-2 w-2/5 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                      />
                      <span>/</span>
                      <div className="flex items-center border border-gray-300 w-3/5 rounded-sm focus-within:border-blue-300 active:border-blue-300">
                        <input
                          type="number"
                          className="py-1.5 px-2 w-full outline-none"
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
                          // eslint-disable-next-line no-constant-condition
                          true
                            ? "text-white bg-blue-600 hover:bg-blue-500"
                            : "text-blue-600 hover:text-blue-500 hover:bg-blue-100/30",
                          "flex w-full justify-center items-center px-3 py-1.5 border border-e-0 rounded-s-sm cursor-pointer border-blue-600"
                        )}
                      >
                        Berbaring
                      </button>
                      <button
                        type="button"
                        className={clsx(
                          // eslint-disable-next-line no-constant-condition
                          false
                            ? "text-white bg-blue-600 hover:bg-blue-500"
                            : "text-blue-600 hover:text-blue-500 hover:bg-blue-100/30",
                          "flex w-full justify-center items-center px-3 py-1.5 border border-s-0 rounded-e-sm cursor-pointer border-blue-600"
                        )}
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
              <form
                className="flex flex-col gap-6"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="bg-white shadow-lg p-6 rounded-md items-center grid grid-cols-1 gap-6">
                  {soaps.length > 0 && (
                    <div className="grid grid-cols-1 gap-12">
                      {soaps.map(({ dokter, datetime, S, O, A, P }, k) => (
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
                                  options={options}
                                  value={dokter}
                                  onChange={(e) =>
                                    cast<{ label: string; value: string }>(
                                      e,
                                      (value) => {
                                        handleChangeSOAP(k, "dokter", value);
                                      }
                                    )
                                  }
                                />
                              </div>
                              <div className="flex flex-1">
                                <input
                                  type="datetime-local"
                                  className="w-full border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                                  required={true}
                                  value={datetime}
                                  onChange={(e) =>
                                    handleChangeSOAP(
                                      k,
                                      "datetime",
                                      e.currentTarget.value
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              className="bg-red-600 hover:bg-red-500 text-white cursor-pointer rounded-sm ml-auto flex items-center justify-center h-[38px] aspect-square outline-0"
                              onClick={() => handleDeleteSOAP(k)}
                            >
                              <HOutline.TrashIcon className="size-5" />
                            </button>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex items-center w-4">
                              <span>S</span>
                            </div>
                            <div className="flex flex-1">
                              <textarea
                                className="w-full border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                                required={true}
                                value={S}
                                onChange={(e) =>
                                  handleChangeSOAP(
                                    k,
                                    "S",
                                    e.currentTarget.value
                                  )
                                }
                              ></textarea>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex items-center w-4">
                              <span>O</span>
                            </div>
                            <div className="flex flex-1">
                              <textarea
                                className="w-full border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                                required={true}
                                value={O}
                                onChange={(e) =>
                                  handleChangeSOAP(
                                    k,
                                    "O",
                                    e.currentTarget.value
                                  )
                                }
                              ></textarea>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex items-center w-4">
                              <span>A</span>
                            </div>
                            <div className="flex flex-1">
                              <textarea
                                className="w-full border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                                required={true}
                                value={A}
                                onChange={(e) =>
                                  handleChangeSOAP(
                                    k,
                                    "A",
                                    e.currentTarget.value
                                  )
                                }
                              ></textarea>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex items-center w-4">
                              <span>P</span>
                            </div>
                            <div className="flex flex-1">
                              <textarea
                                className="w-full border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300"
                                required={true}
                                value={P}
                                onChange={(e) =>
                                  handleChangeSOAP(
                                    k,
                                    "P",
                                    e.currentTarget.value
                                  )
                                }
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex">
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer rounded-sm ml-auto flex items-center justify-between outline-0"
                      onClick={handleTambahSOAP}
                    >
                      <HOutline.PlusIcon className="size-5" />
                      <span className="ml-2">Tabmah SOAP</span>
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

                <div className="flex">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white cursor-pointer rounded-sm ml-auto flex items-center justify-between outline-0"
                  >
                    Simpan
                  </button>
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

import { FC, FormEventHandler, useEffect, useRef, useState } from "react";
import * as HOutline from "@heroicons/react/24/outline";
import Select from "react-select";
import { cast, styles } from "../../../utils/react-select";
import { options } from "../../../mock/react-select";
import { Toast } from "../../../utils/alert";
import { Stage, Layer, Line, Image } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<{ tool: string; points: number[] }[]>([]);
  const isDrawing = useRef<boolean>(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [dimensions, setDimensions] = useState<{
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
      setImage(img);
      updateSize(img);
    };

    const updateSize = (img: HTMLImageElement) => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const newWidth = containerWidth;
        const newHeight = newWidth / aspectRatio;

        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    const handleResize = () => {
      if (image) {
        updateSize(image);
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
      setLines((prevLines) => [
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
      setLines((prevLines) => {
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

  return (
    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmitSOAP}>
      <div className="grid grid-cols-2 gap-6 auto-rows-min">
        <div ref={containerRef}>
          <Stage
            width={dimensions.width}
            height={dimensions.height}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
          >
            <Layer>
              {image && (
                <Image
                  image={image}
                  width={dimensions.width}
                  height={dimensions.height}
                />
              )}
            </Layer>
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke="#000000"
                  strokeWidth={5}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation="source-over"
                />
              ))}
            </Layer>
          </Stage>
        </div>
        <div className="flex flex-col">
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
                            handleChangeSOAP(k, "S", e.currentTarget.value)
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
                            handleChangeSOAP(k, "O", e.currentTarget.value)
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
                            handleChangeSOAP(k, "A", e.currentTarget.value)
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
                            handleChangeSOAP(k, "P", e.currentTarget.value)
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
        </div>
      </div>

      <div className="flex">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white cursor-pointer rounded-sm ml-auto flex items-center justify-between outline-0"
        >
          <HOutline.CheckIcon className="size-5" />
          <span className="ml-2">Simpan SOAP</span>
        </button>
      </div>
    </form>
  );
};

export default SOAP;

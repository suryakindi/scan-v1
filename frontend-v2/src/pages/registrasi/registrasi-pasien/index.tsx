import { FC } from "react";

const RegistrasiPasien: FC = () => {
  return (
    <form className="flex flex-1 flex-col gap-5">
      <div className="bg-white rounded-md overflow-hidden flex flex-col">
        <div className="p-5 flex items-center justify-between">
          <span className="font-medium text-xl">Registrasi Pasien</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-md overflow-hidden flex p-5">
          <div className="flex flex-col w-full">
            <label
              htmlFor="no-medical-record"
              className="block mb-1 text-sm font-medium"
            >
              No Medical Record
            </label>
            <div className="flex items-center gap-2.5">
              <input
                type="text"
                id="no-medical-record"
                className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
                placeholder="No Medical Record"
                required
              />
              <button
                type="button"
                className="cursor-pointer text-white bg-indigo-700 hover:bg-indigo-500 hover:scale-110 transition-all duration-300 rounded-sm px-2.5 h-full"
              >
                <span>Auto</span>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-md overflow-hidden flex p-5">
          <div className="flex flex-col w-full">
            <label htmlFor="no-bpjs" className="block mb-1 text-sm font-medium">
              No BPJS
            </label>
            <input
              type="text"
              id="no-bpjs"
              className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
              placeholder="No BPJS"
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md overflow-hidden p-5 grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="nama" className="block mb-1 text-sm font-medium">
            Nama
          </label>
          <input
            type="text"
            id="nama"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="Nama"
            required
          />
        </div>
        <div>
          <label htmlFor="nik" className="block mb-1 text-sm font-medium">
            nik
          </label>
          <input
            type="text"
            id="nik"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="nik"
            required
          />
        </div>
        <div>
          <label
            htmlFor="tempat-lahir"
            className="block mb-1 text-sm font-medium"
          >
            tempat-lahir
          </label>
          <input
            type="text"
            id="tempat-lahir"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="tempat-lahir"
            required
          />
        </div>
        <div>
          <label
            htmlFor="tanggal-lahir"
            className="block mb-1 text-sm font-medium"
          >
            tanggal-lahir
          </label>
          <input
            type="text"
            id="tanggal-lahir"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="tanggal-lahir"
            required
          />
        </div>
        <div>
          <label htmlFor="agama" className="block mb-1 text-sm font-medium">
            agama
          </label>
          <input
            type="text"
            id="agama"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="agama"
            required
          />
        </div>
        <div>
          <label
            htmlFor="pendidikan-terakhir"
            className="block mb-1 text-sm font-medium"
          >
            pendidikan-terakhir
          </label>
          <input
            type="text"
            id="pendidikan-terakhir"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="pendidikan-terakhir"
            required
          />
        </div>
        <div>
          <label htmlFor="pekerjaan" className="block mb-1 text-sm font-medium">
            pekerjaan
          </label>
          <input
            type="text"
            id="pekerjaan"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="pekerjaan"
            required
          />
        </div>
        <div>
          <label htmlFor="no-telpon" className="block mb-1 text-sm font-medium">
            no-telpon
          </label>
          <input
            type="text"
            id="no-telpon"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="no-telpon"
            required
          />
        </div>
        <div>
          <label
            htmlFor="nama-bapak"
            className="block mb-1 text-sm font-medium"
          >
            nama-bapak
          </label>
          <input
            type="text"
            id="nama-bapak"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="nama-bapak"
            required
          />
        </div>
        <div>
          <label htmlFor="nama-ibu" className="block mb-1 text-sm font-medium">
            nama-ibu
          </label>
          <input
            type="text"
            id="nama-ibu"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="nama-ibu"
            required
          />
        </div>
        <div>
          <label
            htmlFor="status-perkawinan"
            className="block mb-1 text-sm font-medium"
          >
            status-perkawinan
          </label>
          <input
            type="text"
            id="status-perkawinan"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="status-perkawinan"
            required
          />
        </div>
        <div>
          <label
            htmlFor="nama-pasangan"
            className="block mb-1 text-sm font-medium"
          >
            nama-pasangan
          </label>
          <input
            type="text"
            id="nama-pasangan"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="nama-pasangan"
            required
          />
        </div>
        <div>
          <label
            htmlFor="golongan-darah"
            className="block mb-1 text-sm font-medium"
          >
            golongan-darah
          </label>
          <input
            type="text"
            id="golongan-darah"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="golongan-darah"
            required
          />
        </div>
      </div>

      <div className="bg-white rounded-md overflow-hidden p-5 gap-5 flex flex-col">
        <div className="grid grid-cols-[3fr_1fr] gap-5">
          <div>
            <label
              htmlFor="alamat-ktp"
              className="block mb-1 text-sm font-medium"
            >
              alamat-ktp
            </label>
            <input
              type="text"
              id="alamat-ktp"
              className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
              placeholder="alamat-ktp"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">rt-rw</label>
            <div className="flex items-center">
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-sm rounded-s-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
                required
              />
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-sm rounded-e-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
                required
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-5">
          <div>
            <label
              htmlFor="provinsi"
              className="block mb-1 text-sm font-medium"
            >
              provinsi
            </label>
            <input
              type="text"
              id="provinsi"
              className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
              placeholder="provinsi"
              required
            />
          </div>
          <div>
            <label htmlFor="kota" className="block mb-1 text-sm font-medium">
              kota
            </label>
            <input
              type="text"
              id="kota"
              className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
              placeholder="kota"
              required
            />
          </div>
          <div>
            <label
              htmlFor="kecamatan"
              className="block mb-1 text-sm font-medium"
            >
              kecamatan
            </label>
            <input
              type="text"
              id="kecamatan"
              className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
              placeholder="kecamatan"
              required
            />
          </div>
          <div>
            <label
              htmlFor="kelurahan"
              className="block mb-1 text-sm font-medium"
            >
              kelurahan
            </label>
            <input
              type="text"
              id="kelurahan"
              className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
              placeholder="kelurahan"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex items-center"></div>
    </form>
  );
};

export default RegistrasiPasien;

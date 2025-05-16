import { FC } from "react";

const RegistrasiPasien: FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="flex flex-1 flex-col gap-5" onSubmit={handleSubmit}>
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
            NIK
          </label>
          <input
            type="text"
            id="nik"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="NIK"
            required
          />
        </div>
        <div>
          <label
            htmlFor="tempat-lahir"
            className="block mb-1 text-sm font-medium"
          >
            Tempat Lahir
          </label>
          <input
            type="text"
            id="tempat-lahir"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="Tempat Lahir"
            required
          />
        </div>
        <div>
          <label
            htmlFor="tanggal-lahir"
            className="block mb-1 text-sm font-medium"
          >
            Tanggal Lahir
          </label>
          <input
            type="text"
            id="tanggal-lahir"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="Tanggal Lahir"
            required
          />
        </div>
        <div>
          <label htmlFor="agama" className="block mb-1 text-sm font-medium">
            Agama
          </label>
          <input
            type="text"
            id="agama"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="Agama"
            required
          />
        </div>
        <div>
          <label
            htmlFor="pendidikan-terakhir"
            className="block mb-1 text-sm font-medium"
          >
            Pendidikan Terakhir
          </label>
          <input
            type="text"
            id="pendidikan-terakhir"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="Pendidikan Terakhir"
            required
          />
        </div>
        <div>
          <label htmlFor="pekerjaan" className="block mb-1 text-sm font-medium">
            Pekerjaan
          </label>
          <input
            type="text"
            id="pekerjaan"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="Pekerjaan"
            required
          />
        </div>
        <div>
          <label htmlFor="no-telpon" className="block mb-1 text-sm font-medium">
            No Telpon
          </label>
          <input
            type="text"
            id="no-telpon"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="No Telpon"
            required
          />
        </div>
        <div>
          <label
            htmlFor="nama-bapak"
            className="block mb-1 text-sm font-medium"
          >
            Nama Bapak
          </label>
          <input
            type="text"
            id="nama-bapak"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="Nama Bapak"
            required
          />
        </div>
        <div>
          <label htmlFor="nama-ibu" className="block mb-1 text-sm font-medium">
            Nama Ibu
          </label>
          <input
            type="text"
            id="nama-ibu"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="Nama Ibu"
            required
          />
        </div>
        <div>
          <label
            htmlFor="status-perkawinan"
            className="block mb-1 text-sm font-medium"
          >
            Status Perkawinan
          </label>
          <input
            type="text"
            id="status-perkawinan"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="Status Perkawinan"
            required
          />
        </div>
        <div>
          <label
            htmlFor="nama-pasangan"
            className="block mb-1 text-sm font-medium"
          >
            Nama Pasangan
          </label>
          <input
            type="text"
            id="nama-pasangan"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="Nama Pasangan"
            required
          />
        </div>
        <div>
          <label
            htmlFor="golongan-darah"
            className="block mb-1 text-sm font-medium"
          >
            Golongan Darah
          </label>
          <input
            type="text"
            id="golongan-darah"
            className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
            placeholder="Golongan Darah"
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
              Alamat KTP
            </label>
            <input
              type="text"
              id="alamat-ktp"
              className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
              placeholder="Alamat KTP"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">RT/RW</label>
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
              Provinsi
            </label>
            <input
              type="text"
              id="provinsi"
              className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
              placeholder="Provinsi"
              required
            />
          </div>
          <div>
            <label htmlFor="kota" className="block mb-1 text-sm font-medium">
              Kota
            </label>
            <input
              type="text"
              id="kota"
              className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
              placeholder="Kota"
              required
            />
          </div>
          <div>
            <label
              htmlFor="kecamatan"
              className="block mb-1 text-sm font-medium"
            >
              Kecamatan
            </label>
            <input
              type="text"
              id="kecamatan"
              className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
              placeholder="Kecamatan"
              required
            />
          </div>
          <div>
            <label
              htmlFor="kelurahan"
              className="block mb-1 text-sm font-medium"
            >
              Kelurahan
            </label>
            <input
              type="text"
              id="kelurahan"
              className="bg-gray-50 border border-gray-300 text-sm rounded-md focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5"
              placeholder="Kelurahan"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="cursor-pointer text-white bg-indigo-700 hover:bg-indigo-500 hover:scale-110 transition-all duration-300 rounded-sm p-2.5"
        >
          <span>Simpan</span>
        </button>
      </div>
    </form>
  );
};

export default RegistrasiPasien;

import { FC, useEffect, useState } from "react";
import { api, ResponseT } from "../../../../utils/api";
import { useParams } from "react-router";

const Kunjungan: FC = () => {
  const param = useParams();

  type RiwayatRegistrasi = {
    id_pasien: number;
    nama: string;
    id_registrasi: number;
    no_registrasi: string;
    tanggal_registrasi: string;
    nama_ruangan_asal: string;
    nama_ruangan_terakhir: string;
    id_jaminan: number;
    penjamin: string;
    tanggal_masuk: null | string;
    tanggal_keluar: null | string;
  };

  const [data, setData] = useState<RiwayatRegistrasi[]>([]);

  const getData = async () => {
    try {
      const response = await api.get<ResponseT<RiwayatRegistrasi[]>>(
        `pasien/riwayat-pasien-id/${param.id}`
      );

      if (response.data.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <span className="text-3xl">Kunjungan</span>
      </div>

      <div className="bg-white shadow-lg p-6 rounded-md">
        <table className="me-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>No Registrasi</th>
              <th>Tanggal Registrasi</th>
              <th>Nama Ruangan Asal</th>
              <th>Nama Ruangan Terakhir</th>
              <th>Penjamin</th>
              <th>Tanggal Masuk Ruangan</th>
              <th>Tanggal Keluar</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, k) => (
              <tr key={k}>
                <td>{item.nama}</td>
                <td>{item.no_registrasi}</td>
                <td>{item.tanggal_registrasi}</td>
                <td>{item.nama_ruangan_asal}</td>
                <td>{item.nama_ruangan_terakhir}</td>
                <td>{item.penjamin}</td>
                <td>{item.tanggal_masuk}</td>
                <td>{item.tanggal_keluar}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Kunjungan;

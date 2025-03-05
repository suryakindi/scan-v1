enum Agama {
  Islam = "Islam",
  Kristen = "Kristen",
  Katolik = "Katolik",
  Hindu = "Hindu",
  Buddha = "Buddha",
  Konghucu = "Konghucu",
  AliranLain = "Aliran Lain",
  Ateis = "Ateis",
  TidakDiketahui = "Tidak Diketahui",
}

enum Pendidikan {
  SD = "SD",
  SMP = "SMP",
  SMA = "SMA",
  Diploma = "Diploma",
  S1 = "S1",
  S2 = "S2",
  S3 = "S3",
  TidakDiketahui = "Tidak Diketahui",
  TidakBelumSekolah = "Tidak/Belum Sekolah",
}

enum Pekerjaan {
  PelajarMahasiswa = "Pelajar/Mahasiswa",
  BelumBekerja = "Belum Bekerja",

  // Pekerjaan di sektor pemerintahan
  CPNS = "CPNS",
  PNS = "PNS",
  PerangkatDesa = "Perangkat Desa",
  PegawaiKaryawanBUMN = "Pegawai/Karyawan BUMN",
  PegawaiKaryawanBUMD = "Pegawai/Karyawan BUMD",

  // Sektor pertahanan & keamanan
  TNI_AD = "TNI AD",
  TNI_AL = "TNI AL",
  TNI_AU = "TNI AU",
  POLRI = "POLRI",

  // Profesi medis & pendidikan
  GuruDosen = "Guru/Dosen",
  Dokter = "Dokter",
  Bidan = "Bidan",
  Perawat = "Perawat",
  Apoteker = "Apoteker",
  TenagaMedisLain = "Tenaga Medis Lain",

  // Pegawai & pekerja formal
  PegawaiSwasta = "Pegawai Swasta",
  PegawaiKaryawan = "Pegawai/Karyawan",

  // Wiraswasta & perdagangan
  Wiraswasta = "Wiraswasta",
  Wirausaha = "Wirausaha",
  Pedagang = "Pedagang",

  // Pekerja sektor informal
  Petani = "Petani",
  Nelayan = "Nelayan",
  Buruh = "Buruh",
  PekerjaSektorInformal = "Pekerja Sektor Informal",
  Migran = "Migran",

  // Pensiunan & purnawirawan
  Purnawirawan = "Purnawirawan",
  Pensiunan = "Pensiunan",

  // Kategori lainnya
  IbuRumahTangga = "Ibu Rumah Tangga",
  TokohAgama = "Tokoh Agama",
  LainLain = "Lain-Lain",
}

enum Perkawinan {
  BelumKawin = "Belum Kawin",
  Kawin = "Kawin",
  CeraiHidup = "Cerai Hidup",
  CeraiMati = "Cerai Mati",
}

enum GolonganDarah {
  A = "A",
  B = "B",
  AB = "AB",
  O = "O",
}

enum JenisKelamin {
  LakiLaki = "Laki Laki",
  Perempuan = "Perempuan",
}
export {
  Agama,
  Pendidikan,
  Pekerjaan,
  Perkawinan,
  GolonganDarah,
  JenisKelamin,
};

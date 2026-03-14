import type { AppTranslations } from './type'

export const ms: AppTranslations = {
  home: {
    heroTitle: 'Kira zakat pelaburan anda dengan lebih mudah',
    heroDescription:
      'Titik permulaan yang lebih jelas untuk aliran zakat anda, dengan fokus visual yang bersih dan ruang untuk pengalaman kalkulator seterusnya.',
    visualTitle: 'Ruang visual utama',
    visualDescription:
      'Pratonton kalkulator, ilustrasi produk, atau visual penerangan boleh dipaparkan di sini.',
    usageEyebrow: 'Cara Penggunaan',
    usageTitle: 'Tiga langkah ringkas untuk mula kira zakat pelaburan anda',
    usageDescription:
      'Susun aliran penggunaan dengan jelas supaya pengguna faham apa yang perlu dibuat dari awal hingga keputusan akhir.',
    placeholder: 'Visual sementara',
    steps: [
      {
        step: 'Langkah 01',
        title: 'Masukkan maklumat pelaburan',
        description:
          'Isi nilai simpanan atau pelaburan anda supaya pengiraan bermula dengan angka yang jelas.',
      },
      {
        step: 'Langkah 02',
        title: 'Semak kelayakan zakat',
        description:
          'Bandingkan jumlah anda dengan syarat asas seperti nisab dan tempoh pegangan yang berkaitan.',
      },
      {
        step: 'Langkah 03',
        title: 'Lihat anggaran akhir',
        description:
          'Dapatkan anggaran zakat yang mudah dibaca sebelum anda teruskan ke tindakan seterusnya.',
      },
    ],
  },
  calculator: {
    eyebrow: 'Penjejak Wallet',
    title: 'Mulakan dengan alamat wallet anda',
    description:
      'Masukkan alamat Solana atau Ethereum terlebih dahulu. Jika Ethereum dipilih, tandakan rangkaian tambahan yang anda mahu jejaki untuk portfolio dan zakat.',
    inputLabel: 'Alamat Wallet',
    inputPlaceholder: 'Tampal alamat wallet anda di sini',
    networkLabel: 'Network',
    networkDescription:
      'Buat pilihan rangkaian asas sebelum alamat disimpan ke senarai pemantauan.',
    solanaValidationError: 'Masukkan alamat Solana yang sah.',
    ethereumValidationError: 'Masukkan alamat Ethereum yang sah.',
    chainsLabel: 'Ethereum Networks To Track',
    chainsDescription:
      'Ethereum mempunyai beberapa L2. Pilih rangkaian yang perlu dipantau bersama alamat ini.',
    addWallet: 'Tambah Wallet',
    trackedTitle: 'Wallet Dipantau',
    trackedDescription:
      'Senarai ini akan digunakan kemudian untuk sambungan data aset sebenar.',
    emptyState: 'Belum ada wallet ditambah.',
    assetsTitle: 'Nilai Aset',
    assetsDescription:
      'Nilai ini masih hardcoded buat masa sekarang untuk memuktamadkan UI.',
    liveValueLabel: 'Nilai semasa portfolio',
    zakatStatusLabel: 'Status zakat',
    zakatDue: 'Perlu bayar zakat',
    zakatNotDue: 'Belum perlu bayar zakat',
    zakatDescriptionDue:
      'Jumlah aset anda melepasi anggaran nisab, jadi zakat pelaburan perlu dibayar.',
    zakatDescriptionNotDue:
      'Jumlah aset anda masih di bawah anggaran nisab semasa.',
    zakatEstimateLabel: 'Anggaran zakat 2.5%',
    nisabLabel: 'Anggaran nisab',
    walletsCountLabel: 'Wallet dipantau',
    chainsCountLabel: 'Network aktif',
    breakdownTitle: 'Pecahan aset',
    breakdown: [
      { label: 'Token utama', value: 'RM 96,400' },
      { label: 'Stablecoins', value: 'RM 31,250' },
      { label: 'Yield / staking', value: 'RM 18,950' },
    ],
    solana: 'Solana',
    ethereum: 'Ethereum',
    chainLabels: {
      ethereum: 'Ethereum Mainnet',
      base: 'Base',
      arbitrum: 'Arbitrum',
      optimism: 'Optimism',
    },
  },
  languageSwitcher: {
    action: 'Tukar bahasa',
    title: 'Bahasa',
  },
  header: {
    calculator: 'Kripto',
    wallet: 'Sambung Wallet',
  },
}

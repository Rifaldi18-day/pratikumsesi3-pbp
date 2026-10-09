//memilih barang minimal 5
// input berupa pilihan item dan barang yang dibeli minimal 3
// menghitung total belanja (op arit)
// menghitung total diskon  >= 50.000 diskon 3% >= 100.000 5% >= 300.000 10% 
// hitung total bayar
// kallau dapat diskon 
// output nya sesuaikan

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const kategoriBarang = {
  1: {
    nama: "Sembako",
    items: [
      { nama: "Beras 100L", harga: 65000 },
      { nama: "Minyak Goreng 2L", harga: 35000 },
      { nama: "Telur 1kg", harga: 40000 },
      { nama: "TABUNG GAS", harga: 25000 }
    ]
  },
  2: {
    nama: "Kosmetik",
    items: [
      { nama: "Sabun Muka", harga: 30000 },
      { nama: "Shampo", harga: 10000 },
      { nama: "Oli samping", harga: 15000 }
    ]
  },
  3: {
    nama: "ATK",
    items: [
      { nama: "Buku Tulis", harga: 10000 },
      { nama: "Pensil 2B", harga: 5000 },
      { nama: "Pulpen", harga: 7000 }
    ]
  }
};

const keranjang = [];

// Menu Awal: Nanya mau beli atau keluar
function menuAwal() {
  console.log("\n=== SISTEM TOKO TITUT ===");
  console.log("1. Beli Barang");
  console.log("2. Keluar");

  rl.question("Pilih menu (1-2): ", (pilihan) => {
    if (pilihan === '1') {
      menuKategori();
    } else if (pilihan === '2') {
      console.log("\nTerima kasih sudah berkunjung ke Toko Titut!");
      rl.close();
    } else {
      console.log("Pilihan gak ada, coba lagi ya!\n");
      menuAwal();
    }
  });
}

// Menu Kategori Barang
function menuKategori() {
  console.log("\n=== KATEGORI BARANG ===");
  console.log("1. Sembako");
  console.log("2. Kosmetik");
  console.log("3. ATK");
  console.log("4. Selesai & Bayar");
  console.log("0. Kembali ke Menu Utama");

  rl.question("Pilih kategori (0-4): ", (pilihan) => {
    if (pilihan === '0') {
      return menuAwal();
    }
    if (pilihan === '4') {
      return cekDanBayar();
    }

    const kategori = kategoriBarang[pilihan];
    if (!kategori) {
      console.log("Pilihan gak ada, coba lagi ya!\n");
      return menuKategori();
    }

    pilihBarang(kategori);
  });
}

// Pilih barang & bakal tetep STAY di kategori ini
function pilihBarang(kategori) {
  console.log(`\n=== KATEGORI ${kategori.nama.toUpperCase()} ===`);
  kategori.items.forEach((item, idx) => {
    console.log(`${idx + 1}. ${item.nama} - Rp${item.harga.toLocaleString('id-ID')}`);
  });
  console.log("0. Kembali ke Menu Kategori");

  rl.question("Pilih barang (masukkan nomor): ", (nomor) => {
    if (nomor === '0') {
      return menuKategori();
    }

    const idx = parseInt(nomor) - 1;
    if (isNaN(idx) || idx < 0 || idx >= kategori.items.length) {
      console.log("Pilihan gak valid, coba lagi!\n");
      return pilihBarang(kategori);
    }

    const barangPilihan = kategori.items[idx];

    rl.question(`Masukkan jumlah ${barangPilihan.nama}: `, (jumlahStr) => {
      const jumlah = parseInt(jumlahStr);

      if (isNaN(jumlah) || jumlah <= 0) {
        console.log("Jumlah harus angka dan lebih dari 0!\n");
        return pilihBarang(kategori);
      }

      keranjang.push({
        nama: barangPilihan.nama,
        harga: barangPilihan.harga,
        jumlah: jumlah
      });

      console.log(`\n[+] Berhasil nambahin ${barangPilihan.nama} (${jumlah}x) ke keranjang!`);
      
      // Langsung panggil pilihBarang lagi biar STAY di kategori ini
      pilihBarang(kategori);
    });
  });
}

function cekDanBayar() {
  if (keranjang.length < 3) {
    console.log(`\n[!] Minimal harus beli 3 barang ya! Kamu baru milih ${keranjang.length} barang.`);
    return menuKategori();
  }
  hitungDanCetak();
}

function hitungDanCetak() {
  let totalBelanja = 0;

  console.log("\n=================================");
  console.log("        RINCIAN BELANJA         ");
  console.log("=================================");

  keranjang.forEach(item => {
    const subtotal = item.harga * item.jumlah;
    totalBelanja += subtotal;
    console.log(`${item.nama} (${item.jumlah}x) : Rp${subtotal.toLocaleString('id-ID')}`);
  });

  // Hitung persentase diskon
  let diskonPersen = 0;
  if (totalBelanja >= 300000) {
    diskonPersen = 10;
  } else if (totalBelanja >= 100000) {
    diskonPersen = 5;
  } else if (totalBelanja >= 50000) {
    diskonPersen = 3;
  }

  // Hitung nominal diskon & total bayar
  const nominalDiskon = (totalBelanja * diskonPersen) / 100;
  const totalBayar = totalBelanja - nominalDiskon;

  console.log("---------------------------------");
  console.log(`Total Belanja : Rp${totalBelanja.toLocaleString('id-ID')}`);

  if (diskonPersen > 0) {
    console.log(`Selamat! Kamu dapet diskon ${diskonPersen}%`);
    console.log(`Potongan Diskon : Rp${nominalDiskon.toLocaleString('id-ID')}`);
  } else {
    console.log("Diskon          : - (Belum mencapai min. Rp50.000)");
  }

  console.log(`Total Bayar     : Rp${totalBayar.toLocaleString('id-ID')}`);
  console.log("=================================");

  rl.close();
}

// Jalankan program awal
menuAwal();
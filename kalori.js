/*
  Catatan Pembaruan & Upgrade Program:
  1. Diferensiasi Satuan Ukur (Waktu vs Repetisi): 
     Program membedakan perhitungan berdasarkan jenis olahraga, menggunakan satuan menit 
     untuk olahraga durasi (seperti Lari/Renang) dan satuan repetisi/kali untuk olahraga beban/bodyweight (seperti Push-up/Sit-up).
  2. Penyesuaian Sudut Pandang (POV Pasca-Olahraga):
     Bahasa interaksi disesuaikan untuk fungsi pencatatan setelah olahraga selesai dilakukan 
     (bukan menanyakan rencana yang akan dilakukan).
  3. Penundaan Output Kalkulasi (Batching Result):
     Program tidak lagi menampilkan hasil kalori secara rinci di tengah proses input, 
     melainkan menyimpan data sementara dan memproses seluruh perhitungan untuk ditampilkan 
     sekaligus di akhir program.
  4. Rangkuman Detail & Akumulasi Total:
     Menampilkan rincian setiap olahraga yang telah dilakukan beserta satuan yang sesuai, 
     diikuti dengan kalkulasi total kalori yang terbakar.
*/

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let totalKalori = 0;
let jumlahAktivitas = 0;
let aktivitasKe = 1;
const riwayatAktivitas = [];

// Daftar pilihan olahraga lengkap dengan tipe satuan (menit / repetisi)
const DAFTAR_OLAHRAGA = {
  1: { nama: "Lari", satuan: "menit", ket: "60 kalori / 5 menit", rumus: (n) => (n / 5) * 60 },
  2: { nama: "Bersepeda", satuan: "menit", ket: "100 kalori / 15 menit", rumus: (n) => (n / 15) * 100 },
  3: { nama: "Renang", satuan: "menit", ket: "150 kalori / 15 menit", rumus: (n) => (n / 15) * 150 },
  4: { nama: "Plank", satuan: "menit", ket: "5 kalori / 1 menit", rumus: (n) => n * 5 },
  5: { nama: "Jalan Santai", satuan: "menit", ket: "80 kalori / 20 menit", rumus: (n) => (n / 20) * 80 },
  6: { nama: "Push-up", satuan: "repetisi", ket: "15 kalori / 30 repetisi", rumus: (n) => (n / 30) * 15 },
  7: { nama: "Sit-up", satuan: "repetisi", ket: "20 kalori / 30 repetisi", rumus: (n) => (n / 30) * 20 },
  8: { nama: "Squat", satuan: "repetisi", ket: "25 kalori / 30 repetisi", rumus: (n) => (n / 30) * 25 },
  9: { nama: "Lompat Tali", satuan: "repetisi", ket: "10 kalori / 50 repetisi", rumus: (n) => (n / 50) * 10 }
};

function tampilkanMenuOlahraga() {
  console.log("\n==============================================");
  console.log("🏋️‍♀️ DAFTAR OLAHRAGA YANG BISA DICATAT 🏋️‍♂️");
  console.log("==============================================");
  for (const key in DAFTAR_OLAHRAGA) {
    const item = DAFTAR_OLAHRAGA[key];
    console.log(`${key}. ${item.nama.padEnd(14)} (${item.satuan.padEnd(8)}) = ${item.ket}`);
  }
  console.log("==============================================\n");
}

function tanyaAwal() {
  console.log("==============================================");
  console.log("🌸 HALOOO CHUUU~! CATAT KALORI OLAHRAGA GEMOY 🌸");
  console.log("==============================================\n");

  rl.question("👉👈 HARI INI KAMU UDAH SELESAI OLAHRAGA NGGAK??? (ya / tidak): ", function(jawab) {
    const respon = jawab.trim().toLowerCase();

    if (respon === "ya" || respon === "y" || respon === "yes") {
      console.log("\nWahhh hebat bangeeeett habis olahraga! Kebanggaan aku nih! ✨💖");
      mintaJumlahAktivitas();
    } else if (respon === "tidak" || respon === "gk" || respon === "gak" || respon === "no" || respon === "n") {
      console.log("\nYahh hari ini belum olahraga yaaa~ Ndak papa kok, istirahat dulu aja! 🛌✨");
      console.log("Kalau besok udah olahraga, jangan lupa catat di sini lagi yaaa! Muaaach! 💖🌸\n");
      rl.close();
    } else {
      console.log("❌ Ihhh jawabnya cuma boleh 'ya' atau 'tidak' dong sayang~ Coba lagi ya! 🥺\n");
      tanyaAwal();
    }
  });
}

function mintaJumlahAktivitas() {
  tampilkanMenuOlahraga();
  rl.question("Tadi kamu habis selesain berapa jenis olahraga? ", function(input) {
    const jumlah = parseInt(input.trim());

    if (isNaN(jumlah) || jumlah <= 0) {
      console.log("\n❌ Ehhh masukan angkanya yang bener doonk! Harus angka positif dan gak boleh 0 yaaa~ 🥺🙏\n");
      mintaJumlahAktivitas();
      return;
    }

    jumlahAktivitas = jumlah;
    tanyaPilihanOlahraga();
  });
}

function tanyaPilihanOlahraga() {
  if (aktivitasKe > jumlahAktivitas) {
    tampilkanRangkuman();
    return;
  }

  console.log(`\n✨ --- Catat Olahraga Ke-${aktivitasKe} dari ${jumlahAktivitas} --- ✨`);
  rl.question("Pilih nomor olahraganya dong (1 - 9): ", function(inputPilihan) {
    const pilihan = parseInt(inputPilihan.trim());

    if (!DAFTAR_OLAHRAGA[pilihan]) {
      console.log("❌ Ih pusing deh! Pilih nomor 1 sampai 9 aja yaaa~ Coba lagi yuk! 🫣");
      tanyaPilihanOlahraga();
      return;
    }

    tanyaJumlah(pilihan);
  });
}

function tanyaJumlah(pilihan) {
  const olahraga = DAFTAR_OLAHRAGA[pilihan];
  const kataTanya = olahraga.satuan === "menit" 
    ? `Berapa menit kamu ${olahraga.nama} tadi? ` 
    : `Berapa repetisi (kali) kamu ${olahraga.nama} tadi? `;

  rl.question(kataTanya, function(inputJumlah) {
    const nilai = parseFloat(inputJumlah.trim());

    if (isNaN(nilai) || nilai <= 0) {
      console.log(`❌ Waduuuh, ${olahraga.satuan}nya harus angka positif lebih dari 0 dong, jangan ngaco ih! 😵‍💫\n`);
      tanyaJumlah(pilihan);
      return;
    }

    const kalori = Math.round(olahraga.rumus(nilai));
    totalKalori += kalori;

    // Catat data ke array tanpa langsung menampilkan output kalori
    riwayatAktivitas.push({
      nama: olahraga.nama,
      jumlah: nilai,
      satuan: olahraga.satuan,
      kalori: kalori
    });

    aktivitasKe++;
    tanyaPilihanOlahraga();
  });
}

function tampilkanRangkuman() {
  console.log("\n==============================================");
  console.log("🎉 RANGKUMAN OLAHRAGA GEMOY YANG UDAH KAMU LAKUIN 🎉");
  console.log("==============================================");
  
  riwayatAktivitas.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.nama} (${item.jumlah} ${item.satuan}) membakar ${item.kalori} kalori`);
  });

  console.log("----------------------------------------------");
  console.log(`🔥 TOTAL KALORI TERBAKAR = ${totalKalori} KALORI!! 🔥`);
  console.log("Kamu hebat bangeeett udah olahraga hari ini! Makin sehat dan makin imut dehhh~ Muaaach! ✨💖🌸\n");

  rl.close();
}

tanyaAwal();
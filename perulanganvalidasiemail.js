/*
  Catatan Pembaruan & Upgrade Program:
  1. Penanganan Multi-Kesalahan Komprehensif: Memastikan seluruh aturan diproses 
     secara independen tanpa ada kriteria yang terlewati.
  2. Validasi Karakter Khusus / Terlarang: Menambahkan pengecekan karakter yang 
     tidak sah dalam email (seperti '#', '!', '$', '%', dll).
  3. Penanganan Struktur Domain Lebih Ketat: Memeriksa posisi titik '.' agar 
     tidak hanya berada di ujung akhir kata (seperti 'gmailcom.').
  4. Interaksi Berulang (Looping): Menggunakan fungsi rekursif agar program terus 
     meminta input ulang sampai seluruh kriteria validasi terpenuhi.
  5. Sanitasi Input: Menggunakan .trim() untuk membersihkan spasi tak sengaja.
*/

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function cekEmailGemoy(input) {
  const email = input.trim();
  const pesanError = [];

  // 1. Cek kalau kosong
  if (email.length === 0) {
    pesanError.push("Ih kok kosong sih, kayak hatiku~ 💔 Isi dulu dooonk!");
    return { valid: false, pesan: pesanError };
  }

  // 2. Cek spasi
  if (email.includes(" ")) {
    pesanError.push("Huwwwaa ada spasinya! 🙈 Email gak boleh pake spasi tauuu, nanti terpisah kayak kita~");
  }

  // 3. Cek karakter terlarang (seperti #, !, $, %, dll)
  const karakterTerlarang = email.match(/[^a-zA-Z0-9.@_+-]/g);
  if (karakterTerlarang) {
    const charUnik = [...new Set(karakterTerlarang)].join(", ");
    pesanError.push(`Ih ada karakter aneh/terlarang '${charUnik}'! Nggak boleh dipakai yaaa~ 😱`);
  }

  const posisiAt = email.indexOf("@");
  const posisiAtTerakhir = email.lastIndexOf("@");

  // 4. Cek karakter '@'
  if (posisiAt === -1) {
    pesanError.push("Ehh karakter '@' nya mana nih? Ketinggalan di rumah yaaa? 🥺");
  } else {
    if (posisiAt !== posisiAtTerakhir) {
      pesanError.push("Waduh '@' nya kebanyakaaan! Cuma boleh SATU aja yaaa, jangan maruk~ 😠");
    }
    if (posisiAt === 0) {
      pesanError.push("Eyyy sebelum '@' harus ada username-nya dong, masa anonim ih~ 🫣");
    }
    if (posisiAt === email.length - 1) {
      pesanError.push("Abis '@' kok sepi banget? Isiin domain-nya dong (contoh: gmail.com)~ 🌾");
    }
  }

  // 5. Cek titik berturut-turut
  if (email.includes("..")) {
    pesanError.push("Omo omo! Titiknya double '..' gitu berturut-turut! Satuan aja ya biar gemoy~ 😵‍💫");
  }

  // 6. Cek titik dan struktur domain
  const posisiTitikTerakhir = email.lastIndexOf(".");
  if (posisiTitikTerakhir === -1) {
    pesanError.push("Aww, harus ada titik '.' nya dong buat domain! Biar pinterrr~ 🐾");
  } else {
    if (posisiAt !== -1 && posisiTitikTerakhir < posisiAt) {
      pesanError.push("Titik '.' nya kok cuma di depan '@'? Harus ada titik setelah '@' dong buat domain-nya~ 🙈");
    } else if (posisiAt !== -1 && posisiTitikTerakhir < posisiAt + 2) {
      pesanError.push("Titik '.' nya jangan nempel banget sama '@' dong, kasih jarak buat nama domain-nya~ 🙈");
    }

    // Cek jika titik ditaruh di paling buntut (contoh: gmailcom.)
    if (posisiTitikTerakhir === email.length - 1) {
      pesanError.push("Titiknya malah ditaruh di paling buntut! Harusnya misahin nama domain, contoh: gmail.com~ 🌾");
    } else if (posisiTitikTerakhir >= email.length - 2) {
      pesanError.push("Ih ekstensinya belum lengkap! Minimal 2 huruf abis titik (contoh: .com, .id) biar syantik~ 💅");
    }
  }

  if (pesanError.length > 0) {
    return { valid: false, pesan: pesanError };
  }

  return { valid: true, emailFormatted: email };
}

function mintaInputEmail() {
  rl.question("👉👈 Masukkan email kamu di sini yaaa: ", function(input) {
    const hasil = cekEmailGemoy(input);

    if (hasil.valid) {
      console.log("\n===========================================");
      console.log(`YAAAAAY! 🎉🎉 Email "${hasil.emailFormatted}" supeeer VALID!!`);
      console.log("Kamu pinter bangeeett, makaciiy udah diisi dengan bener~ Muaaach! ✨💖🌸");
      console.log("===========================================\n");
      rl.close();
    } else {
      console.log(`\nNdaaa boleh gityuuu! Ada ${hasil.pesan.length} kesalahan nih: ❌`);
      hasil.pesan.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item}`);
      });
      console.log("\nCoba benerin lagi yuk yuk yuk! 🥺🙏\n");
      
      mintaInputEmail();
    }
  });
}

console.log("==============================================");
console.log("🌸 HALOOO CHUUU~! PROGRAM VALIDASI EMAIL GEMOY 🌸");
console.log("==============================================\n");

mintaInputEmail();
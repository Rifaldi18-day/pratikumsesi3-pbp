const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Masukin angkanya: ", (input) => {
  const angka = parseInt(input);

  if (isNaN(angka) || angka < 0) {
    console.log('Masukin angka positif atau minimal nol ya!');
  } else {
    let faktorial = 1;
    for (let i = 1; i <= angka; i++) {
      faktorial *= i; // sama aja kaya: faktorial = faktorial * i
    }
    console.log(`Faktorial dari ${angka} adalah ${faktorial}`);
  }

  rl.close();
});
const readline = require('readline');
const axios = require('axios');

const kirimPesan = async (nomor, pesan) => {
  let data = JSON.stringify({
    number: nomor,
    message: pesan
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://wa.if.unismuh.ac.id/send-message', // Ganti dengan URL yang sesuai
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  await axios.request(config);
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function getInput(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (input) => {
      resolve(input);
    });
  });
}

async function kirimPesanKeNomor(nomor, pesan, jumlahPesan, delay) {
  for (let i = 0; i < jumlahPesan; i++) {
    try {
      await kirimPesan(nomor, pesan);
      console.log(`Pesan ke-${i + 1} berhasil dikirim ke nomor ${nomor}`);
    } catch (error) {
      console.error(`Pesan ke-${i + 1} gagal dikirim ke nomor ${nomor}: ${error.message}`);
    }
    if (i < jumlahPesan - 1) {
      await new Promise(resolve => setTimeout(resolve, delay * 1000)); // Mengonversi detik menjadi milidetik
    }
  }
}

const scheduleMessage = async () => {
  const nomorTujuan = await getInput('Masukkan nomor tujuan: ');
  const pesan = await getInput('Masukkan pesan: ');
  const jumlahPesan = parseInt(await getInput('Masukkan jumlah pesan yang ingin dikirim: '));
  const waktuJedaMenit = parseInt(await getInput('Masukkan waktu jeda antara pesan (dalam menit): '));

  const scheduledTime = new Date().getTime() + waktuJedaMenit * 60 * 1000;
  console.log(`Pesan pertama akan dikirimkan pada: ${new Date(scheduledTime).toLocaleString()}`);

  await new Promise(resolve => setTimeout(resolve, waktuJedaMenit * 60 * 1000)); // Mengonversi menit menjadi milidetik
  await kirimPesanKeNomor(nomorTujuan, pesan, jumlahPesan, waktuJedaMenit * 60);
  rl.close();
};

const main = async () => {
  rl.question('Pilih opsi:\n1. Kirim pesan sekarang\n2. Jadwalkan pengiriman pesan\n3. Kirim pesan ke beberapa nomor\nPilih opsi (1/2/3): ', async (opsi) => {
    if (opsi === '1') {
      const nomorTujuan = await getInput('Masukkan nomor tujuan: ');
      const pesan = await getInput('Masukkan pesan: ');
      const jumlahPesan = parseInt(await getInput('Masukkan jumlah pesan yang ingin dikirim: '));
      const delayDetik = parseInt(await getInput('Masukkan waktu delay antara pengiriman (dalam detik): '));
      await kirimPesanKeNomor(nomorTujuan, pesan, jumlahPesan, delayDetik);
      rl.close();
    } else if (opsi === '2') {
      await scheduleMessage();
    } else if (opsi === '3') {
      const listNomor = await getInput('Masukkan daftar nomor tujuan (pisahkan dengan koma): ');
      const nomorArray = listNomor.split(',').map(nomor => nomor.trim());
      const pesan = await getInput('Masukkan pesan: ');
      const jumlahPesan = parseInt(await getInput('Masukkan jumlah pesan yang ingin dikirim untuk setiap nomor: '));
      const delayDetik = parseInt(await getInput('Masukkan waktu delay antara pengiriman (dalam detik): '));

      for (const nomorTujuan of nomorArray) {
        await kirimPesanKeNomor(nomorTujuan, pesan, jumlahPesan, delayDetik);
      }

      rl.close();

    }
  });
};

main();

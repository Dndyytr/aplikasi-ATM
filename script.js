let correctPin = "123456";
let saldo = 100000;
let attempts = 3;

// fungsi max 6
function limitInputLength(input, maxLength) {
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
  }
}

// enter
document.getElementById("pin-input").addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    checkPin();
  }
});

// Fungsi untuk memeriksa PIN
function checkPin() {
  let inputPinElement = document.getElementById("pin-input");
  let inputPin = inputPinElement.value;
  let message = document.getElementById("pin-message");

  if (inputPin === correctPin) {
    document.getElementById("pin-section").classList.add("hidden");
    document.getElementById("menu-section").classList.remove("hidden");
  } else if (inputPin === "") {
    message.textContent = "PIN tidak diisi! Silakan isi.";
  } else {
    attempts--;
    message.textContent = `PIN salah! Percobaan tersisa: ${attempts}`;

    // Kosongkan input menggunakan variabel yang sudah ada
    inputPinElement.value = "";

    if (attempts === 0) {
      message.textContent = "Maaf, kartu Anda diblokir sementara!";
      inputPinElement.disabled = true;
    }
  }
}

// fungsi membuat ID transaksi
function generateTransactionID(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

// fungsi mutasi
function mutasi() {
  const overlay = document.querySelector(".overlay");
  const notifikasi = document.querySelector(".notifikasi");
  notifikasi.classList.add("active");
  overlay.classList.add("active");
  document.getElementById("ok").addEventListener("click", () => {
    notifikasi.classList.remove("active");
    overlay.classList.remove("active");
  });
}

// Fungsi untuk menampilkan saldo
function showBalance() {
  document.getElementById("saldo-section").classList.remove("hidden");
  document.getElementById("menu-section").classList.add("hidden");
  document.getElementById(
    "isi-saldo"
  ).textContent = `Saldo Anda: Rp ${saldo.toLocaleString("id-ID")}`;
}

// Fungsi untuk menampilkan form transfer
function showTransfer() {
  document.getElementById("menu-section").classList.add("hidden");
  document.getElementById("transfer1").classList.remove("hidden");
}

function transfer1() {
  let rekening = document.getElementById("transfer-rekening").value;
  let message = document.getElementById("rekening-message");
  if (rekening === "" || rekening <= 0) {
    message.textContent = `Nomor rekening tidak diisi! silahkan isi`;
  } else {
    document.getElementById("transfer1").classList.add("hidden");
    document.getElementById("transfer-section").classList.remove("hidden");
  }
}

// Fungsi untuk melakukan transfer
function transfer() {
  const transactionID = generateTransactionID(20);
  const date = new Date();
  const tanggal = date.toLocaleDateString("id-ID");
  const waktu = date.toLocaleTimeString("id-ID");

  let nmrRekening = document.getElementById("transfer-rekening").value;
  let transferAmount = parseInt(
    document.getElementById("transfer-amount").value
  );
  let message = document.getElementById("transfer-message");

  const adminFee = 1000;

  if (isNaN(transferAmount) || transferAmount <= 0) {
    message.textContent = "Masukkan nominal yang valid!";
  } // Cek apakah saldo cukup termasuk biaya admin
  else if (transferAmount + adminFee > saldo) {
    message.textContent = "Saldo tidak cukup!";
    document.getElementById("transfer-amount").value = "";
  }
  // Cek apakah saldo akan menjadi negatif
  else if (saldo - (transferAmount + adminFee) < 0) {
    message.textContent = "Saldo tidak cukup untuk menutupi biaya admin!";
    document.getElementById("transfer-amount").value = "";
  } else {
    saldo -= transferAmount + adminFee;
    mutasi();
    document.getElementById("tanggal").innerHTML = `${tanggal} &ensp; ${waktu}`;
    document.getElementById("nmrRekening").innerHTML = `${nmrRekening}`;
    document.getElementById(
      "nominalnya"
    ).innerHTML = `Rp ${transferAmount.toLocaleString("id-ID")}`;
    document.getElementById("kodenya").innerHTML = `${transactionID}`;
    document.getElementById("transfer-amount").value = "";
    backToMenu();
  }
}

// Fungsi untuk menampilkan form tarik tunai
function showWithdraw() {
  document.getElementById("menu-section").classList.add("hidden");
  document.getElementById("withdraw-section").classList.remove("hidden");
}

// fungsi pilih rekening
function jenisRekening() {
  let withdrawAmount = parseInt(
    document.getElementById("withdraw-amount").value
  );
  let message = document.getElementById("withdraw-message");

  if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
    message.textContent = "Masukkan nominal yang valid!";
  } else if (withdrawAmount > saldo) {
    message.textContent = "Saldo tidak cukup!";
    document.getElementById("withdraw-amount").value = "";
  } else {
    document.getElementById("tabungan-section").classList.remove("hidden");
    document.getElementById("withdraw-section").classList.add("hidden");
  }
}

// Fungsi untuk melakukan penarikan
function withdraw() {
  let withdrawAmount = parseInt(
    document.getElementById("withdraw-amount").value
  );
  document.getElementById("suara").play();
  saldo -= withdrawAmount;
  document.getElementById("withdraw-amount").value = "";
  document.querySelector(".ceklis").classList.add("active");
  document.querySelector(".overlay").classList.add("active");
  backToMenu();
  setTimeout(() => {
    document.querySelector(".ceklis").classList.remove("active");
    document.querySelector(".overlay").classList.remove("active");
    document.getElementById("suara").pause();
    document.getElementById("suara").currentTime = 0;
  }, 5500);
}

// Fungsi untuk kembali ke menu utama
function backToMenu() {
  document.getElementById("transfer-section").classList.add("hidden");
  document.getElementById("transfer1").classList.add("hidden");
  document.getElementById("menu-section").classList.remove("hidden");
  document.getElementById("saldo-section").classList.add("hidden");
  document.getElementById("withdraw-section").classList.add("hidden");
  document.getElementById("tabungan-section").classList.add("hidden");
  document.getElementById("transfer-message").textContent = "";
  document.getElementById("rekening-message").textContent = "";
  document.getElementById("withdraw-message").textContent = "";
  document.getElementById("transfer-rekening").value = "";
  document.getElementById("withdraw-amount").value = "";
  document.getElementById("transfer-amount").value = "";
}

function logout() {
  // Hapus data localStorage atau sessionStorage
  localStorage.clear();
  sessionStorage.clear();

  // Refresh halaman browser
  window.location.reload();
}

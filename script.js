
// ==========================================
// DATA PENGGUNA TERDAFTAR
// ==========================================

const users = [
    {
        nim: "264316022",
        name: "Noval Angga"
    },
    {
        nim: "264316028",
        name: "Varel Daffa"
    },
    {
        nim: "264316006",
        name: "Andriansyah"
    },
    {
        nim: "264316013",
        name: "Mahendra"
    },
    {
        nim: "264316008",
        name: "Dwi Resyarina Aszahra"
    }
];


// ==========================================
// ELEMENT WEBSITE
// ==========================================

const scanButton = document.getElementById("scanButton");
const fingerprintSelect = document.getElementById("fingerprintSelect");
const fingerprintIcon = document.getElementById("fingerprintIcon");

const scanMessage = document.getElementById("scanMessage");
const scanStatus = document.getElementById("scanStatus");

const doorVisual = document.getElementById("doorVisual");
const doorIcon = document.getElementById("doorIcon");
const doorMessage = document.getElementById("doorMessage");
const doorDescription = document.getElementById("doorDescription");

const doorStatus = document.getElementById("doorStatus");
const lockStatus = document.getElementById("lockStatus");

const totalScan = document.getElementById("totalScan");
const successCount = document.getElementById("successCount");
const failedCount = document.getElementById("failedCount");

const activityTable = document.getElementById("activityTable");


// ==========================================
// VARIABEL STATISTIK
// ==========================================

let total = 0;
let success = 0;
let failed = 0;
let scanNumber = 0;
let autoLockTimer = null;


// ==========================================
// UPDATE WAKTU
// ==========================================

function updateDateTime() {

    const now = new Date();

    document.getElementById("dateTime").textContent =
        now.toLocaleString("id-ID");

}

updateDateTime();

setInterval(updateDateTime, 1000);


// ==========================================
// PENCARIAN PENGGUNA BERDASARKAN NIM
// ==========================================

function findUserByNIM(nim) {

    return users.find(user => user.nim === nim) || null;

}


// ==========================================
// STATUS PINTU TERKUNCI
// ==========================================

function setDoorLocked() {

    clearTimeout(autoLockTimer);

    doorVisual.classList.remove("open");
    doorIcon.className = "fa-solid fa-lock";

    doorMessage.textContent = "DOOR LOCKED";

    doorDescription.textContent =
        "Pintu dalam kondisi terkunci.";

    doorStatus.textContent = "Locked";
    lockStatus.textContent = "Active";

}


// ==========================================
// MEMBUKA PINTU
// ==========================================

function unlockDoor() {

    doorVisual.classList.add("open");
    doorIcon.className = "fa-solid fa-lock-open";

    doorMessage.textContent = "DOOR OPEN";

    doorDescription.textContent =
        "Akses diterima. Pintu terbuka.";

    doorStatus.textContent = "Open";
    lockStatus.textContent = "Unlocked";

    // Auto lock setelah 5 detik
    autoLockTimer = setTimeout(() => {

        setDoorLocked();

        doorDescription.textContent =
            "Pintu terkunci otomatis setelah 5 detik.";

    }, 5000);

}


// ==========================================
// CATAT LOG AKTIVITAS
// ==========================================

function addActivity(user) {

    scanNumber++;

    const row = document.createElement("tr");

    const time = new Date().toLocaleTimeString("id-ID");

    const nim = user ? user.nim : "UNKNOWN";

    const userName = user
        ? user.name
        : "Tidak Dikenal";

    const result = user
        ? "Berhasil"
        : "Ditolak";

    const door = user
        ? "Terbuka"
        : "Terkunci";

    row.innerHTML = `
        <td>${scanNumber}</td>
        <td>${time}</td>
        <td>${nim}</td>
        <td>${userName}</td>
        <td>${result}</td>
        <td>${door}</td>
    `;

    const emptyLog = document.getElementById("emptyLog");

    if (emptyLog) {
        emptyLog.remove();
    }

    activityTable.prepend(row);

}


// ==========================================
// UPDATE STATISTIK
// ==========================================

function updateStatistics() {

    totalScan.textContent = total;

    successCount.textContent = success;

    failedCount.textContent = failed;

}


// ==========================================
// SIMULASI SCAN FINGERPRINT
// ==========================================

scanButton.addEventListener("click", function() {

    clearTimeout(autoLockTimer);

    scanButton.disabled = true;

    scanMessage.textContent = "Scanning...";

    scanStatus.textContent =
        "Sedang membaca sidik jari...";

    fingerprintIcon.style.color = "#facc15";

    fingerprintIcon.style.animation =
        "pulse 1s infinite";

    doorDescription.textContent =
        "Memproses autentikasi...";

    setTimeout(function() {

        // Mengambil NIM pengguna yang dipilih
        const selectedNIM = fingerprintSelect.value;

        // Mencocokkan NIM dengan database
        const currentUser = findUserByNIM(selectedNIM);

        // Validasi identitas pengguna
        const isValid = currentUser !== null;

        total++;

        fingerprintIcon.style.animation = "none";

        if (isValid) {

            // Jika pengguna terdaftar
            success++;

            scanMessage.textContent = "Access Granted";

            scanStatus.textContent =
                "Sidik jari berhasil dikenali. Selamat datang, " +
                currentUser.name +
                " (" +
                currentUser.nim +
                ").";

            fingerprintIcon.style.color = "#4ade80";

            // Membuka pintu
            unlockDoor();

        } else {

            // Jika pengguna tidak terdaftar
            failed++;

            scanMessage.textContent = "Access Denied";

            scanStatus.textContent =
                "Sidik jari tidak terdaftar. Akses ditolak.";

            fingerprintIcon.style.color = "#f87171";

            // Pintu tetap terkunci
            setDoorLocked();

            doorMessage.textContent = "ACCESS DENIED";

            doorDescription.textContent =
                "Sidik jari tidak dikenali. Pintu tetap terkunci.";

        }

        // Menambahkan aktivitas ke log
        addActivity(currentUser);

        // Memperbarui statistik
        updateStatistics();

        scanButton.disabled = false;

    }, 2000);

});


// ==========================================
// TOMBOL AUTO LOCK
// ==========================================

document.getElementById("autoLockButton")
.addEventListener("click", function() {

    setDoorLocked();

    doorDescription.textContent =
        "Penguncian pintu dilakukan secara manual.";

});


// ==========================================
// HAPUS LOG AKTIVITAS
// ==========================================

document.getElementById("clearLogButton")
.addEventListener("click", function() {

    activityTable.innerHTML = `
        <tr id="emptyLog">
            <td colspan="6">
                Belum ada aktivitas pemindaian.
            </td>
        </tr>
    `;

    scanNumber = 0;

});


// ==========================================
// NAVIGASI AKTIF
// ==========================================

document.querySelectorAll(".navbar a").forEach(link => {

    link.addEventListener("click", function() {

        document.querySelectorAll(".navbar a")
        .forEach(item => item.classList.remove("active"));

        this.classList.add("active");

    });

});

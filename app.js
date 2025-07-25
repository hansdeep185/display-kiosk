function connectWS() {
  const socket = new WebSocket("ws://localhost:8081");

  socket.onopen = () => {
    console.log("[WS] Connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("[WS] Message received:", data);

    // Simpan data status terakhir ke localStorage
    localStorage.setItem("printInfo", JSON.stringify(data));

    // Tangani status "printing"
    if (data.status === "printing") {
      if (!location.href.includes("printing.html")) {
        window.location.href = "printing.html";
      } else {
        // Kalau sudah di printing.html, cukup update isi DOM
        updatePrintDisplay(data);
      }
      return;
    }

    // Tangani status "done"
    if (data.status === "done") {
      if (!location.href.includes("done.html")) {
        window.location.href = "done.html";
      }

      // Setelah 20 detik, kembali ke halaman utama
      setTimeout(() => {
        window.location.href = "index.html";
      }, 20000);
      return;
    }

    // Tangani status "idle"
    if (data.status === "idle") {
      if (!location.href.includes("index.html")) {
        window.location.href = "index.html";
      }
    }
  };

  socket.onclose = () => {
    console.warn("[WS] Disconnected. Reconnecting in 3s...");
    setTimeout(connectWS, 3000);
  };

  socket.onerror = (err) => {
    console.error("[WS] Error:", err);
    socket.close();
  };
}

// Fungsi tambahan untuk update tampilan DOM (jika halaman printing.html sedang aktif)
function updatePrintDisplay(data) {
  if (!document.getElementById("nama")) return; // Bukan halaman printing
  document.getElementById("nama").textContent = data.nama || "-";
  document.getElementById("file").textContent = data.file || "-";
  document.getElementById("halaman").textContent = data.halaman || "-";
}

connectWS();

let doneTimeoutId = null; // global timeout tracker
let failedTimeoutId = null; // tracker untuk failed redirect

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
      // Batalkan timeout dari done / failed jika ada
      if (doneTimeoutId) {
        clearTimeout(doneTimeoutId);
        doneTimeoutId = null;
        console.log("[WS] Canceled return-to-index timeout (printing masuk)");
      }
      if (failedTimeoutId) {
        clearTimeout(failedTimeoutId);
        failedTimeoutId = null;
        console.log("[WS] Canceled return-to-index timeout (printing masuk)");
      }

      if (!location.href.includes("printing.html")) {
        window.location.href = "printing.html";
      } else {
        updatePrintDisplay(data); // Update tampilan jika sudah di printing
      }
      return;
    }

    // Tangani status "done"
    if (data.status === "done") {
      if (!location.href.includes("done.html")) {
        window.location.href = "done.html";
      }

      // Set timer kembali ke index setelah 20 detik
      if (!doneTimeoutId) {
        doneTimeoutId = setTimeout(() => {
          console.log("[WS] Redirecting to index after done delay...");
          window.location.href = "index.html";
        }, 20000);
      }
      return;
    }

    // Tangani status "failed"
    if (data.status === "failed") {
      if (!location.href.includes("failed.html")) {
        window.location.href = "failed.html";
      }

      // Set timer kembali ke index setelah 20 detik
      if (!failedTimeoutId) {
        failedTimeoutId = setTimeout(() => {
          console.log("[WS] Redirecting to index after failed delay...");
          window.location.href = "index.html";
        }, 20000);
      }
      return;
    }

    // Tangani status "idle"
    if (data.status === "idle") {
      if (
        !location.href.includes("index.html") &&
        !location.href.includes("done.html") &&
        !location.href.includes("printing.html") &&
        !location.href.includes("failed.html")
      ) {
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

// Fungsi tambahan untuk update tampilan DOM (hanya untuk printing.html)
function updatePrintDisplay(data) {
  if (!document.getElementById("nama")) return;
  document.getElementById("nama").textContent = data.nama || "-";
  document.getElementById("file").textContent = data.file || "-";
  document.getElementById("halaman").textContent = data.halaman || "-";
}

connectWS();

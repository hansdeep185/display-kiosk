let socket = null;
let currentBatch = null;

function connectWebSocket() {
  socket = new WebSocket("ws://localhost:8081");

  socket.onopen = () => {
    console.log("[WS] Connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("[WS] Data diterima:", data);

    if (data.status === "printing") {
      // Kalau batch baru, update tampilan dan localStorage
      if (currentBatch !== data.nama + data.file) {
        currentBatch = data.nama + data.file;
        localStorage.setItem("printInfo", JSON.stringify(data));
        location.reload(); // Refresh agar tampilan file baru muncul
      }
    }

    else if (data.status === "done") {
      // Setelah delay 2 detik agar tampilan bisa dilihat dulu
      setTimeout(() => {
        window.location.href = "done.html";
      }, 2000);
    }

    else if (data.status === "idle") {
      // Fallback jika kosong
      window.location.href = "index.html";
    }
  };

  socket.onclose = () => {
    console.warn("[WS] Connection closed. Reconnecting...");
    setTimeout(connectWebSocket, 2000);
  };
}

// Panggil koneksi saat laman dimuat
window.addEventListener("DOMContentLoaded", () => {
  connectWebSocket();
});

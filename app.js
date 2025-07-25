function connectWS() {
  const socket = new WebSocket("ws://localhost:8081");

  socket.onopen = () => {
    console.log("[WS] Connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("[WS] Message received:", data);

    if (data.status === "printing") {
      localStorage.setItem("printInfo", JSON.stringify(data));
      if (!location.href.includes("printing.html")) {
        window.location.href = "printing.html";
      }
    }

    if (data.status === "done") {
      if (!location.href.includes("done.html")) {
        window.location.href = "done.html";
      }

      setTimeout(() => {
        window.location.href = "index.html";
      }, 20000);
    }

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

connectWS();

import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);
useEffect(() => {
  fetch("http://103.238.235.227/api/ProductAccount/get-product-account?ProductId=1", {
    method: "GET",
    headers: {
      accept: "*/*"
    }
  })
    .then(async (res) => {
      const contentType = res.headers.get("content-type");
      console.log("✅ HTTP Status:", res.status, res.statusText);

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid JSON response");
      }

      const data = await res.json();
      console.log("📦 JSON Body:", data);

      setData(data); // nếu mọi thứ OK
    })
    .catch((err) => {
      console.error("❌ Caught error:", err.message || err);
      setData({ error: "Request failed: " + err.message });
    });
}, []);


  return (
    <div style={{ padding: "2rem" }}>
      <h1>🧪 API Test Result</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;

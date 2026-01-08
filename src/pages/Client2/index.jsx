import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
const PHONE_NUMBER = import.meta.env.VITE_WA_NUMBER;

function Client2() {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [folderId, setFolderId] = useState(""); 
  const [loading, setLoading] = useState(true);
  
  const userName = localStorage.getItem("userName") || "Pelanggan";

  // --- STEP 1: Ambil Kode Folder berdasarkan EDITED_ID = 1 ---
  useEffect(() => {
    const fetchEventFolder = async () => {
      try {
        const response = await fetch("https://famous-michaelina-nayakavisual-62f8d376.koyeb.app/events/");
        const data = await response.json();
        
        // MENCARI BERDASARKAN edited_id BUKAN id biasa
        const eventTerpilih = data.find(ev => ev.edited_id === 2);

        if (eventTerpilih && eventTerpilih.kode_folder) {
          setFolderId(eventTerpilih.kode_folder);
          console.log("Folder ditemukan dengan edited_id 2:", eventTerpilih.kode_folder);
        } else {
          console.error("Event dengan edited_id 2 tidak ditemukan");
          setLoading(false);
        }
      } catch (err) {
        console.error("Gagal mengambil data events:", err);
        setLoading(false);
      }
    };

    fetchEventFolder();
  }, []);

  // --- STEP 2: Ambil Foto dari Google Drive ---
  useEffect(() => {
    if (!folderId) return;

    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name)&key=${API_KEY}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setImages(data.files || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data Drive:", err);
        setLoading(false);
      });
  }, [folderId]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const waText = selectedImages
    .map((img, i) => `${i + 1}. ${img.name}`)
    .join("\n");

  const waLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
    `Halo Nayaka Visuals, saya (${userName}) telah memilih foto berikut:\n\n${waText}`
  )}`;

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h2 style={styles.logo}>
          Hai <span style={{ color: "#800000" }}>{userName}</span>, 
          silahkan pilih foto yang ingin di edit!
        </h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </header>

      <div style={styles.content}>
        <div style={styles.titleSection}>
          <h3>Galeri Foto</h3>
          {loading ? <p>Memuat galeri...</p> : <p>Folder Aktif: {folderId ? "Tersambung" : "Tidak Ditemukan"}</p>}
        </div>

        <div style={styles.grid}>
          {images.map((img) => {
            const isSelected = selectedImages.some((item) => item.id === img.id);
            return (
              <div key={img.id} style={styles.card}>
                <img
                  src={`https://lh3.googleusercontent.com/d/${img.id}=w1000`}
                  referrerPolicy="no-referrer"
                  alt={img.name}
                  style={styles.image}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/250?text=Foto+Tidak+Muat"; }}
                />
                <div style={styles.cardInfo}>
                  <span style={styles.fileName}>{img.name}</span>
                  <button
                    disabled={isSelected}
                    onClick={() => setSelectedImages((prev) => [...prev, img])}
                    style={{
                      ...styles.selectBtn,
                      background: isSelected ? "#ccc" : "#800000",
                    }}
                  >
                    {isSelected ? "✓ Terpilih" : "Pilih Foto"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {selectedImages.length > 0 && (
          <div style={styles.summaryBox}>
            <h4>Foto Terpilih: {selectedImages.length}</h4>
            <div style={styles.scrollArea}>
               {selectedImages.map((img, idx) => (
                 <div key={idx} style={styles.listItem}>{img.name}</div>
               ))}
            </div>
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={styles.waBtn}>
              Kirim Ke WhatsApp
            </a>
            <button onClick={() => setSelectedImages([])} style={styles.clearBtn}>Reset</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: { minHeight: "100vh", background: "#f9f9f9", fontFamily: "Arial" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 30px", background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 100 },
  logo: { margin: 0, fontSize: "18px" },
  logoutBtn: { background: "#333", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" },
  content: { padding: "30px" },
  titleSection: { marginBottom: "25px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" },
  card: { background: "#fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" },
  image: { width: "100%", height: "250px", objectFit: "cover" },
  cardInfo: { padding: "12px", display: "flex", flexDirection: "column", gap: "8px" },
  fileName: { fontSize: "12px", color: "#666", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  selectBtn: { color: "#fff", border: "none", padding: "8px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  summaryBox: { position: "fixed", bottom: "20px", right: "20px", width: "280px", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" },
  scrollArea: { maxHeight: "150px", overflowY: "auto", marginBottom: "15px" },
  listItem: { padding: "5px 0", fontSize: "12px", borderBottom: "1px solid #eee" },
  waBtn: { display: "block", textAlign: "center", background: "#25D366", color: "#fff", textDecoration: "none", padding: "10px", borderRadius: "6px", fontWeight: "bold" },
  clearBtn: { width: "100%", background: "none", border: "1px solid #ccc", marginTop: "5px", padding: "5px", borderRadius: "5px", cursor: "pointer" }
};

export default Client2;
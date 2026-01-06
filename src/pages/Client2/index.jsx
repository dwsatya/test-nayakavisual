import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
const FOLDER_ID = import.meta.env.VITE_FOLDER_ID_CLIENT2;
const PHONE_NUMBER = import.meta.env.VITE_WA_NUMBER;

function Client2() {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name)&key=${API_KEY}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setImages(data.files || []))
      .catch(console.error);
  }, []);

  // === WHATSAPP MESSAGE ===
  const waText = selectedImages
    .map((img, i) => `${i + 1}. ${img.name}`)
    .join("\n");

  const waLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
    `Halo, saya memilih foto berikut:\n\n${waText}`
  )}`;

  return (
    <div style={{ padding: 24 }}>
      <h2>Pilih Foto</h2>

      {/* GRID FOTO */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 250px)",
          gap: 16,
        }}
      >
        {images.map((img) => {
          const isSelected = selectedImages.some(
            (item) => item.id === img.id
          );

          return (
            <div
              key={img.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <img
                src={`https://lh3.googleusercontent.com/d/${img.id}=w1000`}
                referrerPolicy="no-referrer"
                alt={img.name}
                style={{
                  width: 250,
                  height: 300,
                  objectFit: "cover",
                  borderRadius: 8,
                  background: "#eee",
                }}
              />

              <button
                disabled={isSelected}
                onClick={() =>
                  setSelectedImages((prev) =>
                    prev.some((i) => i.id === img.id)
                      ? prev
                      : [...prev, img]
                  )
                }
                style={{
                  padding: 8,
                  borderRadius: 6,
                  border: "none",
                  background: isSelected ? "#aaa" : "#800000",
                  color: "white",
                  cursor: isSelected ? "not-allowed" : "pointer",
                  fontWeight: 600,
                }}
              >
                {isSelected ? "Dipilih" : "Pilih"}
              </button>
            </div>
          );
        })}
      </div>

      {/* HASIL PILIHAN */}
      <div style={{ marginTop: 40 }}>
        <h3>Foto Dipilih ({selectedImages.length})</h3>

        {selectedImages.length === 0 ? (
          <p>Belum ada foto dipilih</p>
        ) : (
          <>
            <ul>
              {selectedImages.map((img) => (
                <li key={img.id}>{img.name}</li>
              ))}
            </ul>

            {/* TOMBOL WA */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: 16,
                padding: "12px 16px",
                background: "#25D366",
                color: "white",
                fontWeight: 600,
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Kirim ke WhatsApp
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default Client2;
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Barcode from "react-barcode";
import { Analytics } from "@vercel/analytics/react";
import Setting from "./components/Setting";

const App = () => {
  const [inpQR, setInpQR] = useState("");
  const [onFocus, setOnFocus] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [imageData, setImageData] = useState(null); // Changed to null for better initial state
  const [urlImage, setUrlImage] = useState("https://pic.re/image/panties");
  const [showMessage, setShowMessage] = useState(false);
  const [dataHoliday, setDataHoliday] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageHoliday, setMessageHoliday] = useState("");
  const [jokes, setJokes] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const barcodeRef = useRef(null);
  const [animeBackground, setAnimeBackground] = useState(localStorage.getItem("animeBackground") === "true" ? true : false); // State khusus untuk anime background
  const [customBackground, setCustomBackground] = useState(""); // State khusus untuk anime background

  const generateBQR = (event) => {
    if (event.target.value === "jokes") {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } else {
      setInpQR(event.target.value);
    }
  };

  // Perbaikan logika download menggunakan canvas API secara langsung
  const handleDownload = () => {
    if (!inpQR) return;

    try {
      setIsDownloading(true);

      // Membuat nama file yang sesuai dengan konten barcode
      const filename = `barcode-${inpQR
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase()}.png`;

      // Mendapatkan SVG yang dihasilkan oleh react-barcode
      const svgElement = barcodeRef.current.querySelector("svg");

      if (!svgElement) {
        throw new Error("Elemen barcode tidak ditemukan");
      }

      // Konversi SVG ke string XML
      const svgData = new XMLSerializer().serializeToString(svgElement);

      // Membuat blob dari string SVG
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });

      // Membuat URL dari blob SVG
      const svgUrl = URL.createObjectURL(svgBlob);

      // Membuat gambar baru untuk proses konversi
      const img = new Image();

      // Ketika gambar telah dimuat, render ke canvas dan download
      img.onload = () => {
        // Membuat canvas dengan ukuran yang sesuai dengan gambar
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        // Mendapatkan konteks 2D
        const ctx = canvas.getContext("2d");

        // Isi dengan background putih
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Gambar SVG ke canvas
        ctx.drawImage(img, 0, 0);

        // Konversi canvas ke dataURL dan download
        try {
          const imgUrl = canvas.toDataURL("image/png");

          // Membuat link download
          const link = document.createElement("a");
          link.href = imgUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();

          // Cleanup
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(svgUrl);
          }, 100);

          setIsDownloading(false);
        } catch (e) {
          console.error("Error converting canvas to data URL", e);
          setError("Gagal mengkonversi barcode: " + e.message);
          setIsDownloading(false);
        }
      };

      // Handler error untuk image loading
      img.onerror = (e) => {
        console.error("Error loading SVG", e);
        setError("Gagal memuat barcode: " + e.message);
        URL.revokeObjectURL(svgUrl);
        setIsDownloading(false);
      };

      // Set source image ke URL SVG untuk memulai proses loading
      img.src = svgUrl;
    } catch (err) {
      console.error("Error downloading the image", err);
      setError("Gagal mendownload barcode: " + err.message);
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch(
          "https://holiday-api-psi.vercel.app/api/holidays"
        );
        if (!response.ok) throw new Error("Gagal Ambil Data Hari Libur");
        const data = await response.json();
        setDataHoliday(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, []);

  useEffect(() => {
    const checkTodayHoliday = () => {
      const today = new Date();
      const currentDateString = today.toISOString().split("T")[0];

      const holiday = dataHoliday.find(
        (item) => item.date?.iso === currentDateString
      );
      if (holiday) {
        setMessageHoliday(holiday);
      } else {
        setMessageHoliday(null);
      }
    };

    if (dataHoliday && dataHoliday.length > 0) {
      checkTodayHoliday();
    }
  }, [dataHoliday]);

  useEffect(() => {
    const content = document.getElementById("content");
    const timer = setTimeout(() => {
      if (content) {
        content.focus();
        setOnFocus(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch image data
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch("https://pic.re/image.json");
        if (!response.ok) throw new Error("Gagal ambil data gambar");
        const data = await response.json();
        setImageData(data);
      } catch (err) {
        console.error("Error in fetch image", err);
        setError(err.message);
      }
    };
    fetchImage();
  }, [refresh]);

  // Effect untuk mengubah background saat anime checkbox berubah
  useEffect(() => {
    if (animeBackground && imageData && imageData.file_url) {
      const getUrl = `https://${imageData?.file_url}`;
      localStorage.setItem("animeBackground", true);
      setUrlImage(getUrl);

      if (!animeBackground) {
        localStorage.setItem("animeBackground", false);
      }
      const myBackground = localStorage.getItem("customBackground");
      if (myBackground) {
        localStorage.setItem("customBackground", ""); // Reset localStorage
      }
    } else if (!animeBackground) {
      localStorage.setItem("animeBackground", false);
      if (customBackground) {
        setUrlImage(customBackground); // Set custom background
      }
      setUrlImage(""); // Reset background jika checkbox dimatikan
      // setCustomBackground("")
      // localStorage.setItem("recentBackground", ""); // Reset localStorage
    }
  }, [animeBackground, imageData?.file_url]);

  // Fungsi untuk menangani file upload
  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUrlImage(e.target.result);
        localStorage.setItem("customBackground", e.target.result); // Simpan ke localStorage
        setCustomBackground(e.target.result); // Set custom background
        setAnimeBackground(false); // Turn off anime background when custom image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const myBackground = localStorage.getItem("customBackground");
    if (myBackground) {
      setUrlImage(myBackground);
      setCustomBackground(myBackground);
      // console.log({myBackground})
    }
  }, [customBackground, urlImage]);

  useEffect(() => {
    const conditionAnimeBg = localStorage.getItem("animeBackground");
    if (conditionAnimeBg === "true") {
      console.log({conditionAnimeBg: conditionAnimeBg, ifelse: 1 === 1});
      setAnimeBackground(1 === 1);
      setUrlImage(`https://${imageData?.file_url}`);
    } else if (conditionAnimeBg === "false") {
      console.log({conditionAnimeBgFalse: conditionAnimeBg, ifelse: !!conditionAnimeBg});
      setAnimeBackground(1 === 0)
      setUrlImage("")
    }
  }, [])

  // useEffect(() => {}, [])

  useEffect(() => {
    const jokeFetching = async() => {
      const response = await fetch("https://candaan-api.vercel.app/api/text/random")
      const data = await response.json()
      setJokes(data.data)
    }
    jokeFetching()
  }, []);

  useEffect(() => {
    const entryMessage = setTimeout(() => {
      setShowMessage(true);
    }, 3000);
    const exitMessage = setTimeout(() => {
      setShowMessage(false);
    }, 15000);
    return () => {
      clearTimeout(entryMessage);
      clearTimeout(exitMessage);
    };
  }, []);

  const Alert = () => (
    <section role="alert" className="absolute top-0 shadow-lg alert">
      <img
        src="vite.svg"
        alt="i"
        className="stroke-info h-8 w-8 shrink-0 aspect-[4/3]"
      />
      <main>
        <h3 className="font-bold">Jokes Bapack2!</h3>
        <article className="text-xs">
        {jokes}
        </article>
      </main>
      <button
        className="btn btn-sm"
        onClick={() =>
          window.open(`https://wa.me/6285190070283`, "_blank")
        }
      >
        apcb
      </button>
    </section>
  );

  return (
    <section
      className="relative flex flex-col items-center justify-around w-full bg-cover min-h-svh rounded-3xl"
      style={{ backgroundImage: `url(${onFocus ? "none" : urlImage})` }}
    >
      {showMessage && <Alert />}
      {loading && (
        <aside className="toast">
          <h3 className="alert alert-info font-semibold text-[#242424] dark:text-white">
            <span>Loading...</span>
          </h3>
        </aside>
      )}
      {error && (
        <aside className="toast">
          <main className="alert alert-error font-semibold text-[#242424] dark:text-white">
            <span>Error: {error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-sm underline"
            >
              Tutup
            </button>
          </main>
        </aside>
      )}
      {messageHoliday && (
        <aside role="alert" className="absolute top-0 shadow-lg alert">
          <img
            src="vite.svg"
            alt="i"
            className="stroke-info h-8 w-8 shrink-0 aspect-[4/3]"
          />
          <main>
            <h3 className="font-bold">{messageHoliday.name}</h3>
            <p className="text-xs">{messageHoliday.description}</p>
          </main>
          <button
            className="btn btn-sm"
            onClick={() =>
              window.open(
                `https://google.com/search?q=${messageHoliday.name}`,
                "_blank"
              )
            }
          >
            See
          </button>
        </aside>
      )}
      <Analytics />
      <main className="grid grid-cols-1 px-12 md:grid-cols-2 md:px-20">
        <h1 className="col-span-2 text-5xl font-bold text-center text-white md:text-7xl md:text-right lg:text-9xl mix-blend-difference">
          Generate Barcode Realtime✨
        </h1>
        <br />
        {inpQR && (
          <main
            ref={barcodeRef}
            className="grid col-span-2 py-4 place-content-center md:col-span-1 md:col-start-1"
          >
            <Barcode
              value={inpQR}
              width={1.8}
              height={80}
              margin={10}
              displayValue={true}
            />
          </main>
        )}
        <main className="grid col-span-2 mt-0 md:col-span-1 md:col-start-2 md:mt-4 place-content-center md:place-content-center">
          <input
            type="text"
            id="content"
            className="border-b-2 border-b-[#242424] dark:border-b-[#F3F6FC] bg-transparent text-white mix-blend-difference md:py-4 text-center outline-none"
            placeholder="MASUKKAN TEKS"
            onChange={generateBQR}
            onFocus={() => setOnFocus(true)}
            onBlur={() => setOnFocus(false)}
          />
        </main>
        <main className="grid col-span-2 md:col-span-1 md:col-start-2 place-content-center md:place-content-center">
          <button
            className="btn btn-wide mt-7"
            onClick={(e) => {
              e.preventDefault();
              handleDownload();
            }}
            disabled={!inpQR || isDownloading}
          >
            {isDownloading ? "Sedang Memproses..." : "Download Barcode"}
          </button>
        </main>
      </main>
      <Setting
        focus={onFocus}
        setFocus={setOnFocus}
        animeBackground={animeBackground}
        setAnimeBackground={setAnimeBackground}
        handleImageUpload={handleImageUpload}
        setRefresh={setRefresh}
        imageUrl={imageData}
        setUrlImage={setUrlImage}
        urlImage={urlImage}
      />
    </section>
  );
};

export default App;

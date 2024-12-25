import React, { useState, useEffect } from "react";
import "./App.css";
import Barcode from "react-barcode";
import { useToImage } from "@hcorta/react-to-image";
import { Analytics } from "@vercel/analytics/react";

const App = () => {
  const [inpQR, setInpQR] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [dataHoliday, setDataHoliday] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageHoliday, setMessageHoliday] = useState("");
  const [onFocus, setOnFocus] = useState(false);
  const { ref, isLoading, getPng } = useToImage();
  const urlImage = "https://pic.re/image/panties";

  const generateBQR = (event) => {
    if (event.target.value === "credit") {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } else {
      setInpQR(event.target.value);
    }
  };

  const handleDownload = async () => {
    try {
      const dataUrl = await getPng();
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "dont-open-this-file.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading the image", err);
    }
  };

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch("https://holiday-api-psi.vercel.app/api/holidays");
        if (!response.ok) throw new Error("Failed to fetch holidays");
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

      const holiday = dataHoliday.find((item) => item.date.iso === currentDateString);
      if (holiday) {
        setMessageHoliday(holiday);
      } else {
        setMessageHoliday(null);
      }
    };
    checkTodayHoliday();
  }, [dataHoliday]);

  useEffect(() => {
    const content = document.getElementById("content");
    const timer = setTimeout(() => {
      content.focus();
      setOnFocus(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const Alert = () => (
    <div role="alert" className="top-0 alert">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="w-6 h-6 stroke-info shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span>Created by Fianity</span>
    </div>
  );

  return (
    <main
      className="flex flex-col items-center justify-around w-full min-h-screen relative bg-cover rounded-3xl"
      style={{ backgroundImage: `url(${onFocus ? "none" : urlImage})` }}
    >
      {showMessage && <Alert />}
      {loading && (
        <div className="toast">
          <div className="alert alert-info font-semibold text-[#242424] dark:text-white">
            <span>Loading...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="toast">
          <div className="alert alert-error font-semibold text-[#242424] dark:text-white">
            <span>Error: {error}</span>
          </div>
        </div>
      )}
      {messageHoliday && (
        <div role="alert" className="alert shadow-lg absolute top-0">
          <img src="vite.svg" alt="i" className="stroke-info h-8 w-8 shrink-0 aspect-[4/3]" />
          <div>
            <h3 className="font-bold">{messageHoliday.name}</h3>
            <div className="text-xs">{messageHoliday.description}</div>
          </div>
          <button
            className="btn btn-sm"
            onClick={() => window.open(`https://google.com/search?q=${messageHoliday.name}`, "_blank")}
          >
            See
          </button>
        </div>
      )}
      <Analytics />
      <div className="Main-content">
        <h1 className="text-8xl md:text-9xl font-bold text-white px-6 mix-blend-difference">
          Generate Barcode Realtime✨
        </h1>
        <br />
        <input
          type="text"
          id="content"
          className="border-b-2 border-b-[#242424] dark:border-b-[#F3F6FC] bg-transparent text-center outline-none"
          placeholder="MASUKKAN TEKS"
          onChange={generateBQR}
          onFocus={() => setOnFocus(true)}
          onBlur={() => setOnFocus(false)}
        />
        {inpQR && (
          <div ref={ref}>
            <Barcode value={inpQR} />
          </div>
        )}
        <button
          className="btn btn-wide"
          onClick={(e) => {
            e.preventDefault();
            handleDownload();
          }}
        >
          Download Barcode
        </button>
      </div>
    </main>
  );
};

export default App;

import { useEffect, useState } from "react";

const Setting = ({ setRefresh, animeBackground, setAnimeBackground, handleImageUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleImageUpload(file);
    }
  };

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };
  
  return (
    <>
      <button
        className="fixed bottom-5 left-5 md:left-10 bg-[#242424] text-white p-2 rounded-full"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        <svg
          className="size-[1.2em]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt">
            <circle
              cx="12"
              cy="12"
              r="3"
              fill="none"
              stroke="currentColor"
              strokeLinecap="square"
              strokeMiterlimit="10"
              strokeWidth="2"
            ></circle>
            <path
              d="m22,13.25v-2.5l-2.318-.966c-.167-.581-.395-1.135-.682-1.654l.954-2.318-1.768-1.768-2.318.954c-.518-.287-1.073-.515-1.654-.682l-.966-2.318h-2.5l-.966,2.318c-.581.167-1.135.395-1.654.682l-2.318-.954-1.768,1.768.954,2.318c-.287.518-.515,1.073-.682,1.654l-2.318.966v2.5l2.318.966c.167.581.395,1.135.682,1.654l-.954,2.318,1.768,1.768,2.318-.954c.518.287,1.073.515,1.654.682l.966,2.318h2.5l.966-2.318c.581-.167,1.135-.395,1.654-.682l2.318.954,1.768-1.768-.954-2.318c.287-.518.515-1.073.682-1.654l2.318-.966Z"
              fill="none"
              stroke="currentColor"
              strokeLinecap="square"
              strokeMiterlimit="10"
              strokeWidth="2"
            ></path>
          </g>
        </svg>
      </button>
      <dialog id="my_modal_1" className="modal">
        <section className="modal-box">
          <h3 className="font-bold text-xl text-left border-1 border-b-[#242424]/10 dark:border-b-white/10">Setting</h3>
          <main className="space-y-4">
            {/* Anime Background Toggle */}
            <div className="flex w-full justify-between items-center mt-4">
              <h4 className="font-medium">Wallpaper Anime</h4>
              <main className="flex items-center gap-2">
                <button onClick={handleRefresh} className={`${!animeBackground ? "cursor-not-allowed opacity-50" : ""} px-2.5 py-1.5 rounded-badge active:opacity-75 bg-[#242424] dark:bg-white text-white dark:text-[#242424]`} disabled={!animeBackground ? true : false }>Refresh</button>
                <label className="swap">
                <input 
                  type="checkbox" 
                  checked={animeBackground}
                  onChange={(e) => setAnimeBackground(e.target.checked)}
                />
                <div className="swap-on bg-[#242424] dark:bg-white p-1.5 rounded-full text-white dark:text-[#242424]">ON</div>
                <div className="swap-off bg-[#242424]/10 dark:bg-white/10 p-1.5 rounded-full dark:text-[#242424]">OFF</div>
              </label>
              </main>
            </div>
            <hr />
            
            {/* Custom Image Upload */}
            <div className="space-y-2">
              <h4 className="font-medium text-left">Custom Background</h4>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  id="customBackground"
                  accept="image/*"
                  className="file-input file-input-bordered file-input-sm w-full mt-2 max-w-xs"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <span className="text-xs truncate max-w-[150px]">
                    {selectedFile.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Upload image akan mematikan wallpaper anime
              </p>
            </div>
          </main>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </section>
      </dialog>
    </>
  );
};

export default Setting;
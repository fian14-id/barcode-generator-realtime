import { list } from "postcss";
import { useEffect, useState } from "react";

const Setting = ({ setRefresh, animeBackground, setAnimeBackground, handleImageUpload, imageUrl, urlImage, setUrlImage }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [listAnimeItems, setListAnimeItems] = useState([]);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleImageUpload(file);
    }
  };

  
  const handleSaveImage = () => {
    const keyBg = "animeBgItems";
    const date = new Date();
    const animeBgData = localStorage.getItem(keyBg);
    let saveItem = []
    if (animeBgData) {
      saveItem = JSON.parse(animeBgData);
    }
    saveItem.push({
      title: `${imageUrl.author} ${imageUrl._id}`,
      image_url: `${imageUrl.file_url}`,
    })
    localStorage.setItem(keyBg, JSON.stringify(saveItem));
    setListAnimeItems(saveItem)
  }
  
  useEffect(() => {
    const animeBgData = localStorage.getItem("animeBgItems");
    if (animeBgData) {
      const parsedData = JSON.parse(animeBgData);
      setListAnimeItems(parsedData);
    }
  }, [])

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };
  
  useEffect(() => {
    const lastItem = listAnimeItems.length - 1
    
    // console.log({currentImage: urlImage, lastItem: listAnimeItems[lastItem]?.image_url})
    const save = document.getElementById("saveAnimeBg");  
    if (urlImage === `https://${listAnimeItems[lastItem]?.image_url}`) {
    save.style.display = "none";
  } else if (urlImage !== `https://${listAnimeItems[lastItem]?.image_url}`){
    save.style.display = "";
  }
  }, [urlImage, listAnimeItems]);

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
            <section className="flex items-center justify-between w-full mt-4">
              <h4 className="font-medium">Wallpaper Anime</h4>
              <main className="flex items-center gap-2">
                <button id="saveAnimeBg" onClick={handleSaveImage} className={`${!animeBackground ? "cursor-not-allowed opacity-10" : ""} p-2 rounded-full active:opacity-75 bg-[#242424] dark:bg-white text-white dark:text-[#242424]`} disabled={!animeBackground ? true : false }><svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bookmark-icon lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg></button>
                <button onClick={handleRefresh} className={`${!animeBackground ? "cursor-not-allowed opacity-10" : ""} px-2.5 py-1.5 rounded-badge active:opacity-75 bg-[#242424] dark:bg-white text-white dark:text-[#242424]`} disabled={!animeBackground ? true : false }>Refresh</button>
                <label className="swap">
                <input 
                  type="checkbox" 
                  checked={animeBackground}
                  onChange={
                    (e) => {
                      setAnimeBackground(e.target.checked);
                      localStorage.setItem("animeBackground", e.target.checked);
                  }
                  }
                />
                <div className="swap-on bg-[#242424] dark:bg-white p-1.5 rounded-full text-white dark:text-[#242424]">ON</div>
                <div className="swap-off bg-[#242424]/10 dark:bg-white/50 p-1.5 rounded-full dark:text-[#242424]">OFF</div>
              </label>
              </main>
            </section>
            <hr />
            
            {/* Custom Image Upload */}
            <section className="space-y-2">
              <h4 className="font-medium text-left">Custom Background</h4>
              <main className="flex items-center space-x-2">
                <input
                  type="file"
                  id="customBackground"
                  accept="image/*"
                  className="w-full max-w-xs mt-2 file-input file-input-bordered file-input-sm"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <span className="text-xs truncate max-w-[150px]">
                    {selectedFile.name}
                  </span>
                )}
              </main>
              <p className="text-xs text-gray-500">
                Upload image akan mematikan wallpaper anime
              </p>
            </section>
            <hr />
            <main>
              <h2 className="font-semibold text-start">Save Wallpaper</h2>
              <ul className="grid grid-cols-2 gap-2 mt-2">
                {listAnimeItems.length > 0 ? listAnimeItems.map((item, index) => (
                  <li key={index} onClick={() => setUrlImage(`https://${item.image_url}`)} className="cursor-pointer col-span-1 w-full bg-[#242424] dark:bg-white text-white dark:text-[#242424] font-extralight py-0.5 rounded-full">{item.title}</li>
                )) : null}
              </ul>
            </main>
          </main>
          <section className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </section>
        </section>
      </dialog>
    </>
  );
};

export default Setting;
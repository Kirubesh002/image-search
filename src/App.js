import { useState } from "react";
import "./index.css";
import AddCaptionPage from "./components/AddCaptionPage";

function App() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCaptionPage, setShowCaptionPage] = useState(false);
  const [page, setPage] = useState(1); // State to track the current page for pagination
  const API_KEY = "_alALEyot3CLxWl8FLtMOSrlQFgx63vxuNDZWyQrUU8";

  const handleSearch = () => {
    if (search) {
      setPage(1); // Reset page to 1 on new search
      setData([]); // Clear previous results
      fetchFun(search, 1); // Fetch the first page of results
    }
  };

  const fetchFun = async (searchValue, pageNumber) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?page=${pageNumber}&query=${searchValue}&per_page=30&client_id=${API_KEY}`
      );
      const jsonData = await response.json();
      setData((prevData) => [...prevData, ...jsonData.results]);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleAddCaption = (image) => {
    setSelectedImage(image);
    setShowCaptionPage(true);
  };

  const closeCaptionPage = () => {
    setShowCaptionPage(false);
    setSelectedImage(null);
  };

  // Function to fetch more images when scrolling or button click
  const loadMoreImages = () => {
    if (search) {
      const nextPage = page + 1;
      setPage(nextPage); // Increment page
      fetchFun(search, nextPage); // Fetch next page of images
    }
  };

  return (
    <div className="container">
      <h1 className="byline">
        Search <span>Image</span>{" "}
      </h1>
      <p style={{ fontSize: "12px" }}>
        "Sometimes, the best photo is the one that takes you back to the{" "}
        <span style={{ color: "#ce0000", fontWeight: "700" }}>
          Happiest Moments.
        </span>
        "
      </p>
      <div className="searchbox">
        <input
          type="search"
          placeholder="Enter your search term"
          className="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {search ? (
        <>
          <p>
            #result <span className="primary-color">{search}</span>{" "}
          </p>
          <div className="image-section">
            {data.map((item, index) => (
              <div key={index} className="image-container">
                <p style={{ fontSize: "12px", textTransform: "capitalize" }}>
                  {item.alt_description || "Untitle"}
                </p>
                <img
                  src={item.urls.small}
                  alt={item.alt_description}
                  className="image"
                />
                <button
                  className="caption-btn"
                  onClick={() => handleAddCaption(item)} // Pass the whole item to handleAddCaption
                >
                  Add Caption
                </button>
              </div>
            ))}
          </div>

          {/* Button to load more images */}
          <button className="load-btn" onClick={loadMoreImages}>
            Fetch More Photos
          </button>
        </>
      ) : (
        <div>Discover your favorite..!</div>
      )}

      {showCaptionPage && selectedImage && (
        <AddCaptionPage
          imageUrl={selectedImage.urls.small}
          closeModal={closeCaptionPage}
        />
      )}
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import axios from "axios"; // ✅ Axios import
import slider1 from "../../assets/slider1.png";
import slider2 from "../../assets/slider2.png";
import slider3 from "../../assets/slider3.png";
import ProductPage from "./Carousel/FiveProduct";
import MainCarousel from "./Carousel/ThreeProduct";

const Home = () => {
  const Trending = [
    { src: slider1, name: "Product 1", price: 100, id: 1 },
    { src: slider2, name: "Product 2", price: 150, id: 2 },
    { src: slider3, name: "Product 3", price: 200, id: 3 },
    { src: slider1, name: "Product 4", price: 100, id: 4 },
    { src: slider2, name: "Product 5", price: 150, id: 5 },
    { src: slider3, name: "Product 6", price: 200, id: 6 },
    { src: slider1, name: "Product 7", price: 100, id: 7 },
    { src: slider2, name: "Product 8", price: 150, id: 8 },
  ];

  const [searchItems, setSearchItems] = useState("");
  const [products, setProducts] = useState([]); // ✅ Original product list from API
  const [filteredProducts, setFilteredProducts] = useState([]); // ✅ Filtered list for search
  const [filterTrending, setFilterTrending] = useState(Trending); // ✅ Trending list

  // 🟢 Fetch data from API
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://reto-india-admin-backend.onrender.com/Product"
      );
      console.log(response.data)
      setProducts(response.data); 
      setFilteredProducts(response.data); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchItems.trim()) {
      setFilteredProducts(products); 
      setFilterTrending(Trending);
      return;
    }

    const filtered = products?.filter((item) =>
      item?.title?.toLowerCase().includes(searchItems.toLowerCase())
    );

    const filteredTrending = Trending.filter((item) =>
      item?.name?.toLowerCase().includes(searchItems.toLowerCase())
    );

    setFilteredProducts(filtered);
    setFilterTrending(filteredTrending);
  }, [searchItems]); 


  return (
    <div
      className="background pt-[30px] md:pt-[50px] lg:pt-[30px] bg-cover bg-no-repeat bg-center min-h-lvh space-y-10 custom-padding"
      style={{
        background: "linear-gradient(462deg, #fdf2e3 51%, #ffd39c 70%)",
      }}
    >
      {/* 🔎 Search Bar */}
      <div className="w-full flex justify-center items-center">
        <div className="w-full sm:w-4/5 md:w-2/3 lg:w-2/5 flex px-[30px] md:pt-0 relative justify-center">
          <input
            type="text"
            value={searchItems}
            onChange={(e) => setSearchItems(e.target.value)}
            className="p-3 w-full rounded-2xl shadow-2xl border-[1px] border-black"
            placeholder="Search for Products"
          />
          <div className="absolute flex right-10 top-4 text-2xl">
            <CiSearch />
          </div>
        </div>
      </div>

      {/* No Results Message */}
      {filteredProducts.length === 0 && filterTrending.length === 0 ? (
        <p className="text-center text-red-500 text-lg font-semibold">
          No Product Found
        </p>
      ) : (
        <>
          {/* ✅ Product Carousels */}
          <MainCarousel trendingProduct={filterTrending} />
          <ProductPage products={filteredProducts} />
        </>
      )}
    </div>
  );
};

export default Home;

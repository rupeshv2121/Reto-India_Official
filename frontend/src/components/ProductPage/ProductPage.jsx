import axios from "axios";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import ProductPage from "./Carousel/FiveProduct";
import MainCarousel from "./Carousel/ThreeProduct";

const Home = () => {
  const [searchItems, setSearchItems] = useState("");
  const [products, setProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [trending, setTrending] = useState([]); 
  const [filteredTrending, setFilteredTrending] = useState([]); 

  // 🟢 Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://reto-india-admin-backend.onrender.com/Product"
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // 🟢 Fetch trending products from API
  const fetchTrending = async () => {
    try {
      const response = await axios.get(
        "https://reto-india-admin-backend.onrender.com/TrendingProduct"
      );
      setTrending(response.data);
      setFilteredTrending(response.data);
    } catch (error) {
      console.error("Error fetching trending products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchTrending();
  }, []);

  useEffect(() => {
    const searchTerm = searchItems.toLowerCase().trim(); // 🟢 Normalize input
  
    if (!searchTerm) {
      setFilteredProducts(products);
      setFilteredTrending(trending);
      return;
    }
  
    const exactMatches = products.filter(
      (item) => item.title?.toLowerCase().trim() === searchTerm
    );
  
    const partialMatches = products.filter(
      (item) => item.title?.toLowerCase().includes(searchTerm)
    );
  
    setFilteredProducts(exactMatches.length > 0 ? exactMatches : partialMatches);
  
    const exactTrending = trending.filter(
      (item) => item.name?.toLowerCase().trim() === searchTerm
    );
  
    const partialTrending = trending.filter(
      (item) => item.name?.toLowerCase().includes(searchTerm)
    );
  
    setFilteredTrending(
      exactTrending.length > 0 ? exactTrending : partialTrending
    );
  }, [searchItems, products, trending]);
  
  console.log(products); // See actual object structure
  

  return (
    <div className="background pt-[30px] md:pt-[50px] lg:pt-[30px] bg-cover bg-no-repeat bg-center min-h-lvh space-y-10 custom-padding">
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
      {filteredProducts.length === 0 && filteredTrending.length === 0 ? (
        <p className="text-center text-red-500 text-lg font-semibold">
          No Product Found
        </p>
      ) : (
        <>
          {/* ✅ Product Carousels */}
          <MainCarousel trendingProduct={filteredTrending} />
          <ProductPage products={filteredProducts} />
        </>
      )}
    </div>
  );
};

export default Home;

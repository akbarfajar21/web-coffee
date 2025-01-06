import React, { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    axios
      .get("https://api.sampleapis.com/coffee/hot")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color="#4A90E2" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="max-w-sm rounded-lg shadow-lg overflow-hidden bg-white cursor-pointer"
            onClick={() => openModal(product)}
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full object-cover h-96"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {product.title}
              </h3>
              <p className="text-gray-600 mt-2">{product.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 text-white bg-gray-700 rounded-full"
        >
          &lt;&lt;
        </button>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 text-white bg-gray-700 rounded-full"
        >
          &lt;
        </button>
        <span className="px-4 py-2 mx-1 text-lg font-semibold rounded-full bg-gray-200">
          {currentPage}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 text-white bg-gray-700 rounded-full"
        >
          &gt;
        </button>
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 text-white bg-gray-700 rounded-full"
        >
          &gt;&gt;
        </button>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 font-bold text-2xl"
            >
              &times;
            </button>
            <h3 className="text-3xl font-semibold text-gray-800">
              {selectedProduct.title}
            </h3>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.title}
              className="w-full object-cover h-96 mt-4"
            />
            <p className="text-gray-600 mt-4">{selectedProduct.description}</p>
            <ul className="mt-4">
              {selectedProduct.ingredients.map((ingredient, index) => (
                <li key={index} className="text-sm text-gray-500">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;

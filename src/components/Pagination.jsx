import React from "react";

export default function Pagination({ totalPages, currentPage, onPageChange }) {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  const handlePageChange = (pageNumber) => {
    onPageChange(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      ></button>
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => handlePageChange(pageNumber)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === pageNumber
              ? "bg-orange-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          {pageNumber}
        </button>
      ))}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      ></button>
    </div>
  );
}

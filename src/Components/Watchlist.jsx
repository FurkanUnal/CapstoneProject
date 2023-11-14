import React, { useState } from "react";
import placeholderImage from "../Assets/chart.png";
import "../index.css";
import FormDialog from "./FormDialog";

const Watchlist = ({ stocks, onAddStock }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startScrollTop, setStartScrollTop] = useState(0);

  // Function to toggle the modal state
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartScrollTop(e.target.scrollTop);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    e.target.scrollTop = startScrollTop - deltaY;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-md mt-4 w-80 watchlist-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="flex items-center justify-between mb-4 ">
        <h2 className="text-2xl font-semibold ">My Watchlist</h2>
        <FormDialog></FormDialog>
      </div>
      <div>
        <ul className="watchlist-scroll-container">
          {stocks.map((stock, index) => (
            <li
              key={stock.id}
              className={`mb-2 p-2 flex items-center justify-between ${
                index !== stocks.length - 1 ? "border-b" : ""
              }`}
            >
              <div className="flex items-center">
                {/* Stock Logo */}
                <img
                  src={placeholderImage} // Replace with the actual URL of the stock logo
                  alt={`${stock.name} Logo`}
                  className="w-8 h-8 mr-2"
                />
                {/* Stock Symbol and Name */}
                <div>
                  <div className="font-semibold">{stock.symbol}</div>
                  <div>{stock.name}</div>
                </div>
              </div>
              {/* Stock Price and Daily Change Percentage */}
              <div className="flex flex-col text-right">
                <div className="font-semibold">${stock.price}</div>
                <div
                  className={
                    stock.returnRate >= 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {stock.returnRate}%
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Watchlist;
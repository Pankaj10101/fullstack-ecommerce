import React, { useState } from "react";
import "./Search.scss";
import { MdClose } from "react-icons/md";

import prod from "../../../assets/products/speaker-prod-4.webp";
import { useNavigate } from "react-router-dom";
import useFetch from "../../../Hooks/useFetch";
const Search = ({ setShowSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleQuery = (e) => {
    setSearchQuery(e.target.value);
  };

  let { data } = useFetch(
    `/api/products?populate=*&filters[title][$contains]=${searchQuery}`
  );

  console.log(data)
  if (!searchQuery.length) data = null;
  return (
    <div className="search-modal">
      <div className="form-field">
        <input
          type="text"
          autoFocus
          placeholder="Search for products"
          onChange={handleQuery}
        />
        <MdClose className="close-btn" onClick={() => setShowSearch(false)} />
      </div>
      <div className="search-result-content">
        <div className="search-results">
          {data?.data.map((item) => (
            <div
              key={item.id}
              className="search-result-item"
              onClick={() => {
                navigate("/product/" + item.id);
                setShowSearch(false);
              }}
            >
              <div className="image-container">
                <img
                  src={
                    process.env.REACT_APP_DEV_URL +
                    item.attributes.img.data[0].attributes.url
                  }
                  alt=""
                />
              </div>
              <div className="prod-details">
                <span className="name">{item.attributes.title}</span>
                <span className="desc">{item.attributes.desc}</span>
              </div>
            </div>)
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;

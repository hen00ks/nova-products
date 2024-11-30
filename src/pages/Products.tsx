import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Products() {
  const [filters, setFilters] = useState({
    search: "",
    use: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    tags: [],
    page: 1,
    pageSize: 4,
    sortBy: "name",
    sortOrder: "asc",
  });

  const { data: productsObject, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => params.append(key, item));
        } else if (value) {
          params.append(key, value);
        }
      });

      return fetch(
        `https://test-api.nova-techs.com/products?${params.toString()}`
      ).then((res) => res.json());
    },
  });

  // console.log(productsObject.data);
  // console.log(filters);

  const reacted = isLoading ? (
    <h1>Loading...</h1>
  ) : (
    productsObject?.data.map((product, i) => {
      return (
        <div key={product.id}>
          <img src={product.imageUrls[0]} alt="product image" />
          <h3>{product.name}</h3>
          <h2>{product.price}</h2>
          <p>{product.use}</p>
        </div>
      );
    })
  );

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="search"
        value={filters.search}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, search: e.target.value }))
        }
      />
      {/* <button>search</button> */}
      <label>
        filter by:
        <select
          value={filters.use}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, use: e.target.value }))
          }
        >
          {/* <option value="" selected disabled hidden>
            use
          </option> */}
          <option hidden>use</option>
          <option>All</option>
          <option value="for_sale">For Sale</option>
          <option value="for_rent">For Rent</option>
          <option value="for_use">For Use</option>
        </select>
      </label>
      <label>
        filter by: Price
        <label>
          min
          <input
            type="number"
            name=""
            id=""
            value={filters.minPrice}
            placeholder="min price"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
            }
          />
        </label>
        <label>
          max
          <input
            type="number"
            name=""
            value={filters.maxPrice}
            id=""
            placeholder="max price"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
            }
          />
        </label>
      </label>
      <label>
        Sort by:
        <select>
          <option value="name" selected>
            Name
          </option>
          <option value="price">Price</option>
          <option value="expiresAt">Expiry date</option>
        </select>
      </label>
      <label>
        Ascending
        <input
          type="radio"
          checked={filters.sortOrder === "asc" ? true : false}
          onClick={() => setFilters((prev) => ({ ...prev, sortOrder: "asc" }))}
          // onClick={(e) => console.log()}
        />
      </label>
      <label>
        Descending
        <input
          type="radio"
          checked={filters.sortOrder === "desc" ? true : false}
          onClick={() => setFilters((prev) => ({ ...prev, sortOrder: "desc" }))}
        />
      </label>
      {reacted}
      <div style={{ marginTop: "20px" }}>
        <button
          disabled={filters.page <= 1}
          onClick={() => handlePageChange(filters.page - 1)}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>Page {filters.page}</span>
        <button
          disabled={productsObject?.data?.length < filters.pageSize}
          onClick={() => handlePageChange(filters.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

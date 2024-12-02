import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

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
  const [openFormModal, setOpenFormModal] = useState(false);

  const inputRefs = {
    productRef: useRef(null),
    descriptionRef: useRef(null),
    priceRef: useRef(null),
    categoryRef: useRef(null),
    imageRef: useRef(null),
    quantityRef: useRef(null),
    addedByRef: useRef(null),
    productUseRef: useRef(null),
    tagsRef: useRef(null),
  };

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
  const queryClient = useQueryClient();

  // const mutation = useMutation({
  //   mutationKey: ["new-product"],
  //   mutationFn: (formData) => {
  //     return fetch("https://test-api.nova-techs.com/products", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //     }).then((res) => res.json());
  //   },
  //   onSuccess: (data) => {
  //     console.log("Product added successfully:", data);
  //     queryClient.invalidateQueries(["products"]);
  //   },
  //   onError: (error) => {
  //     console.error("Error submitting review:", error.message);
  //   },
  // });

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

  function handleForm(e) {
    e.preventDefault();
    const formData = {
      name: inputRefs.productRef.current?.value || "",
      description: inputRefs.descriptionRef.current?.value || "",
      price: parseFloat(inputRefs.priceRef.current?.value || 0),
      sellingPrice: parseFloat(inputRefs.priceRef.current?.value || 0),
      category: inputRefs.categoryRef.current?.value || "",
      tags: inputRefs.tagsRef.current?.value.split(" ").filter((tag) => tag),
      quantityOnHand: parseInt(inputRefs.quantityRef.current?.value || 0),
      use: inputRefs.productUseRef.current?.value || "",
      addedBy: inputRefs.addedByRef.current?.value || "",
      imageUrls: inputRefs.imageRef.current?.value
        ? [inputRefs.imageRef.current.value]
        : [],
      minimumQuantity: 0,
      expiresAt: "2025-02-22T20:51:03.739Z",
      reservedQuantity: 0,
      discount: 0,
    };

    console.log(inputRefs.imageRef.current);

    console.log(formData);
    // mutation.mutate(formData);
  }

  return (
    <div>
      <button onClick={() => setOpenFormModal(true)}>Add product</button>
      {openFormModal && (
        <form onSubmit={handleForm}>
          <label>
            Product name:
            <input
              ref={inputRefs.productRef}
              type="text"
              placeholder="eg: laptop"
            />
          </label>
          <label>
            Description:
            <input
              ref={inputRefs.descriptionRef}
              type="text"
              placeholder="eg: 10th gen core i5"
            />
          </label>
          <label>
            Price:
            <input
              ref={inputRefs.priceRef}
              type="number"
              placeholder="eg: 52,000"
            />
          </label>
          <label>
            Category:
            <select ref={inputRefs.categoryRef}>
              <option value="clothing">Clothing</option>
              <option value="furniture">Furniture</option>
              <option value="electronics">Electronics</option>
            </select>
          </label>
          <label>
            Tags:
            <input ref={inputRefs.tagsRef} type="text" placeholder="eg: new" />
          </label>
          <label>
            use:
            <select ref={inputRefs.productUseRef}>
              <option value="for_sale">For Sale</option>
              <option value="for_rent">For Rent</option>
              <option value="for_use">For Use</option>
            </select>
          </label>
          <label>
            Added by:
            <input
              ref={inputRefs.addedByRef}
              type="text"
              placeholder="eg: kaleb"
            />
          </label>
          <label>
            Quantity on hand:
            <input
              ref={inputRefs.quantityRef}
              type="number"
              placeholder="eg: 123"
            />
          </label>
          <input ref={inputRefs.imageRef} type="file" placeholder="add image" />
          <button type="submit">Add product</button>
        </form>
      )}
      <div>
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
            onClick={() =>
              setFilters((prev) => ({ ...prev, sortOrder: "asc" }))
            }
            // onClick={(e) => console.log()}
          />
        </label>
        <label>
          Descending
          <input
            type="radio"
            checked={filters.sortOrder === "desc" ? true : false}
            onClick={() =>
              setFilters((prev) => ({ ...prev, sortOrder: "desc" }))
            }
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
    </div>
  );
}

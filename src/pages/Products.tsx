import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useDisclosure } from "@mantine/hooks";
import {
  ActionIcon,
  Box,
  Button,
  CloseButton,
  Flex,
  Group,
  Input,
  Modal,
  Radio,
  RangeSlider,
  SegmentedControl,
  Select,
  SimpleGrid,
  Switch,
} from "@mantine/core";
import {
  FaPlus,
  FaMagnifyingGlass,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [value, setValue] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    use: "",
    category: "",
    minPrice: null,
    maxPrice: null,
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

  const {
    data: productsObject,
    isLoading,
    isFetched,
  } = useQuery({
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

  isFetched && console.log(productsObject.data);
  // console.log(filters);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["new-product"],
    mutationFn: (formData) => {
      return fetch("https://test-api.nova-techs.com/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      console.log("Product added successfully:", data);
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error("Error submitting review:", error.message);
    },
  });

  const reacted = isLoading ? (
    <h1>Loading...</h1>
  ) : (
    isFetched &&
    productsObject?.data.map((product, i) => {
      return (
        <ProductCard
          key={product.id}
          imageUrls={product.imageUrls}
          productName={product.name}
          price={product.price}
          use={product.use}
          description={product.description}
          tags={product.tags}
        />
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
      quantityOnHand: parseInt(inputRefs.quantityRef.current?.value || 1),
      use: inputRefs.productUseRef.current?.value || "",
      addedBy: inputRefs.addedByRef.current?.value || "",
      imageUrls: inputRefs.imageRef.current?.value
        ? [inputRefs.imageRef.current.value]
        : [],
      minimumQuantity: 1,
      expiresAt: "2025-02-22T20:51:03.739Z",
      reservedQuantity: 1,
      discount: 1,
    };

    console.log(formData);
    mutation.mutate(formData);
  }

  const [opened, { open, close }] = useDisclosure(false);
  const marks = [
    { value: 0, label: "min" },
    { value: 1000, label: "max(1000 ETB)" },
  ];

  return (
    <div>
      <Header />
      <Button
        color="#25262b"
        size="sm"
        leftSection={<FaPlus size={14} />}
        onClick={open}
      >
        Add product
      </Button>
      <Modal opened={opened} onClose={close} title="Add product" centered>
        <form onSubmit={handleForm}>
          <Input.Wrapper label="Product name">
            <Input ref={inputRefs.productRef} placeholder="eg: laptop" />
          </Input.Wrapper>
          <Input.Wrapper label="Description">
            <Input
              ref={inputRefs.descriptionRef}
              placeholder="eg: 10th gen core i5"
            />
          </Input.Wrapper>
          <Input.Wrapper label="Price">
            <Input
              ref={inputRefs.priceRef}
              type="number"
              placeholder="eg: 52,000"
            />
          </Input.Wrapper>
          <Select
            label="Category"
            ref={inputRefs.categoryRef}
            placeholder="Pick value"
            data={[
              { value: "clothing", label: "Clothing" },
              { value: "furniture", label: "Furniture" },
              { value: "electronics", label: "Electronics" },
            ]}
          />
          <Input.Wrapper label="Tags">
            <Input ref={inputRefs.tagsRef} placeholder="eg: new" />
          </Input.Wrapper>
          <Select
            label="Use"
            ref={inputRefs.productUseRef}
            placeholder="Pick value"
            data={[
              { value: "for_sale", label: "For Sale" },
              { value: "for_rent", label: "For Rent" },
              { value: "for_use", label: "For Use" },
            ]}
          />
          <Input.Wrapper label="Added by">
            <Input ref={inputRefs.addedByRef} placeholder="eg: kaleb" />
          </Input.Wrapper>
          <Input.Wrapper label="Quantity on hand">
            <Input
              ref={inputRefs.quantityRef}
              type="number"
              placeholder="eg: 123"
            />
          </Input.Wrapper>
          <Input.Wrapper label="Added by">
            <Input ref={inputRefs.imageRef} placeholder="eg: add image URL" />
          </Input.Wrapper>
          <Button type="submit" fullWidth>
            Add product
          </Button>
        </form>
      </Modal>

      <Input
        leftSection={<FaMagnifyingGlass size={16} />}
        placeholder="search for product"
        value={filters.search}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, search: e.target.value }))
        }
        rightSectionPointerEvents="all"
        mt="md"
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
            style={{ display: filters.search ? undefined : "none" }}
          />
        }
      />
      <Select
        label="Filter by:"
        placeholder="Use"
        data={[
          { value: "for_sale", label: "For Sale" },
          { value: "for_rent", label: "For Rent" },
          { value: "for_use", label: "For Use" },
        ]}
        value={filters.use}
        onChange={(_value, option) =>
          setFilters((prev) => ({ ...prev, use: _value }))
        }
        defaultValue=""
        clearable
      />
      <RangeSlider
        mx={"15%"}
        defaultValue={[0, 1000]}
        min={0}
        max={1000}
        step={10}
        marks={marks}
        onChangeEnd={(val) =>
          setFilters((prev) => ({
            ...prev,
            minPrice: parseInt(val[0]),
            maxPrice: parseInt(val[1]),
          }))
        }
      />
      <Select
        label="Sort by:"
        data={[
          { value: "name", label: "Product name" },
          { value: "price", label: "Price" },
          { value: "createdAt", label: "Time listed" },
        ]}
        value={filters.sortBy}
        onChange={(_value, option) =>
          setFilters((prev) => ({ ...prev, sortBy: _value }))
        }
      />
      {/* <Group>
        <p>ascending</p>
        <Switch
          size="lg"
          onLabel={<FaChevronDown />}
          offLabel={<FaChevronUp />}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              sortOrder: e.target.checked ? "desc" : "asc",
            }))
          }
        />
        <p>descending</p>
      </Group> */}
      <SegmentedControl
        value={filters.sortOrder === "desc" ? "Descending" : "Ascending"}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            sortOrder: e === "Descending" ? "desc" : "asc",
          }))
        }
        data={["Ascending", "Descending"]}
      />
      <div>
        <SimpleGrid cols={2} spacing="xl" verticalSpacing="xl" m="xl">
          {reacted}
        </SimpleGrid>

        <Flex justify={"center"}>
          <Group align="center">
            <ActionIcon
              variant="default"
              size="lg"
              disabled={filters.page <= 1}
              onClick={() => handlePageChange(filters.page - 1)}
              aria-label="previous page"
            >
              <FaChevronLeft />
            </ActionIcon>
            <span style={{ margin: "0 10px" }}>Page {filters.page}</span>
            <ActionIcon
              variant="default"
              size="lg"
              disabled={productsObject?.data?.length < filters.pageSize}
              onClick={() => handlePageChange(filters.page + 1)}
              aria-label="previous page"
            >
              <FaChevronRight />
            </ActionIcon>
          </Group>
        </Flex>
      </div>
    </div>
  );
}

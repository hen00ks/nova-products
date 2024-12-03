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
import ProductForm from "../components/ProductForm";

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

  // isFetched && console.log(productsObject.data);
  // console.log(filters);

  const reacted = isLoading ? (
    <h1>Loading...</h1>
  ) : (
    isFetched &&
    productsObject?.data.map((product, i) => {
      return (
        <Link to={`/details/${product.id}`}>
          <ProductCard
            key={product.id}
            imageUrls={product.imageUrls}
            productName={product.name}
            price={product.price}
            use={product.use}
            description={product.description}
            tags={product.tags}
          />
        </Link>
      );
    })
  );

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const [opened, { open, close }] = useDisclosure(false);
  const marks = [
    { value: 0, label: "min" },
    { value: 1000, label: "max(1000 ETB)" },
  ];

  return (
    <div>
      <Header page="Products" />
      <Button
        color="#25262b"
        size="sm"
        leftSection={<FaPlus size={14} />}
        onClick={open}
      >
        Add product
      </Button>
      <Modal opened={opened} onClose={close} title="Add product" centered>
        <ProductForm />
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

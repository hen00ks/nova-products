import {
  Paper,
  Image,
  Stack,
  Group,
  Button,
  Box,
  Flex,
  Modal,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { FaChevronRight } from "react-icons/fa6";
import { Link, Outlet, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useDisclosure } from "@mantine/hooks";
import ProductForm from "../components/ProductForm";

export default function Details() {
  // const productId = "cm3ta1ihj0002fmf637p13mr8";
  const { id: productId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["productid"],
    queryFn: () => {
      return fetch(
        `https://test-api.nova-techs.com/products/${productId}`
      ).then((res) => res.json());
    },
  });

  //   console.log(data);

  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [
    updateModalOpened,
    { open: openUpdateModal, close: closeUpdateModal },
  ] = useDisclosure(false);

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <div>
      <Header page="Details" />
      <Flex>
        <Box>
          {/* <img src={data.imageUrls[0]} alt="" /> */}
          <Group>
            <Paper shadow="sm" radius="md" p="md" w={400}>
              <Image src={data.imageUrls[0]} alt="product image" radius="md" />
            </Paper>
            <Stack>
              <Group>
                <div>
                  <Modal
                    opened={deleteModalOpened}
                    onClose={closeDeleteModal}
                    title="Delete product"
                  >
                    {/* Modal content */}
                    <h2>Are you sure?</h2>
                    <p>this action is irreversible</p>
                    <Group justify="end">
                      <Button variant="light" color="red">
                        Delete
                      </Button>
                      <Button variant="default" onClick={closeDeleteModal}>
                        Cancel
                      </Button>
                    </Group>
                  </Modal>

                  <Button
                    onClick={openDeleteModal}
                    variant="filled"
                    color="red"
                  >
                    Delete
                  </Button>
                  <Modal
                    opened={updateModalOpened}
                    onClose={closeUpdateModal}
                    title="Update product"
                  >
                    <ProductForm updateProductData={data} />
                  </Modal>
                  <Button onClick={openUpdateModal}>Update</Button>
                </div>
              </Group>
              <h1>{data.name}</h1>
              <h2>
                {data.price}
                <sub>ETB</sub>
                <sup style={{ color: "lime" }}>{data.discount}% off</sup>
              </h2>

              <h2>created at:{data.createdAt}</h2>
              <h2>expires on:{data.expiresAt}</h2>
              <h2>{data.addedBy}</h2>
              <h2>
                {data.use.split("_").map((word) => (
                  <span>{word} </span>
                ))}
              </h2>

              <Link to="reviews">
                <Button
                  fullWidth
                  variant="outline"
                  justify="space-between"
                  rightSection={<FaChevronRight />}
                >
                  REVIEWS
                </Button>
              </Link>
            </Stack>
          </Group>
          <div>
            <p>{data.description}</p>
          </div>
        </Box>
        <Outlet />
      </Flex>
    </div>
  );
}

import {
  Paper,
  Image,
  Stack,
  Group,
  Button,
  Box,
  Modal,
  Drawer,
  Badge,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  FaChevronRight,
  FaDatabase,
  FaTrashCan,
  FaUser,
} from "react-icons/fa6";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { useDisclosure } from "@mantine/hooks";
import Reviews from "../components/Reviews";
import AddorUpdateModal, { actionTypes } from "../components/AddorUpdateModal";
import DeleteModal from "../components/DeleteModal";

export default function Details() {
  // const productId = "cm3ta1ihj0002fmf637p13mr8";
  const { productId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["productid"],
    queryFn: () => {
      return fetch(
        `https://test-api.nova-techs.com/products/${productId}`
      ).then((res) => res.json());
    },
  });

  //   console.log(data);
  const [opened, { open, close }] = useDisclosure(false);

  if (isLoading) return <h2>Loading...</h2>;

  const features =
    data.tags.length === 0 ? (
      <Badge variant="light">No tags</Badge>
    ) : (
      data.tags.map((badge, i) => (
        <Badge variant="light" key={i}>
          {badge}
        </Badge>
      ))
    );

  const date = new Date(data.createdAt);
  const expirydate = new Date(data.expiresAt);

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const formattedExpiryDate = expirydate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div>
      <Header page="Details" />
      <Stack className="max-w-[1000px] mx-auto px-4">
        <Box>
          <Group align="start" justify="space-between">
            <Group>
              <Paper
                shadow="md"
                radius="md"
                p="md"
                className="w-[min(420px,100vw)] aspect-square"
              >
                <Image
                  src={data.imageUrls[0]}
                  alt="product image"
                  radius="md"
                  fit="contain"
                  className="size-full"
                />
              </Paper>
              <Stack>
                <h1 className="text-lg font-bold">{data.name}</h1>
                <Group>
                  <FaUser />
                  <h2>{data.addedBy}</h2>
                </Group>
                <Group>{features}</Group>

                <h2>Listed on: {formattedDate.replace(", ", "-")}</h2>
                <h2>Expires on: {formattedExpiryDate.replace(", ", "-")}</h2>
                <h1 className="text-lg font-bold">
                  {data.use.split("_").map((word) => (
                    <span>{word} </span>
                  ))}
                </h1>
                <h2 className="text-4xl font-bold">
                  {data.price}
                  <sub className="text-xl">ETB</sub>
                  <sup className="text-sky-500 text-xl">
                    {data.discount}% OFF
                  </sup>
                </h2>
                <Drawer
                  offset={8}
                  radius="md"
                  position="right"
                  opened={opened}
                  onClose={close}
                  title="Reviews"
                  h={"100%"}
                  overlayProps={{ backgroundOpacity: 0 }}
                >
                  <Reviews productId={productId} />
                </Drawer>

                <Button
                  fullWidth
                  variant="outline"
                  justify="space-between"
                  rightSection={<FaChevronRight />}
                  onClick={open}
                >
                  REVIEWS
                </Button>
              </Stack>
            </Group>
            <Group>
              <AddorUpdateModal
                action={actionTypes.Update}
                updateProductData={data}
              />
              <DeleteModal productId={productId as string} />
            </Group>
          </Group>
          <div className="mt-12">
            <p>
              <strong>Description: </strong>
              {data.description}
            </p>
          </div>
        </Box>
      </Stack>
    </div>
  );
}

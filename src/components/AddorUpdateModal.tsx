import { Button, Modal } from "@mantine/core";
import ProductForm from "./ProductForm";
import { FaDatabase, FaPlus } from "react-icons/fa6";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

export enum actionTypes {
  Add = "Add",
  Update = "Update",
  Delete = "Delete",
}

interface propTypes {
  action: actionTypes;
  updateProductData: {} | null;
}

export default function AddorUpdateModal(props: propTypes) {
  const [opened, { open, close }] = useDisclosure(false);

  const isMobile = useMediaQuery("(max-width: 50em)");

  return (
    <>
      <Button
        color="#25262b"
        size="sm"
        leftSection={props.action === "Add" ? <FaPlus /> : <FaDatabase />}
        onClick={open}
      >
        {props.action} product
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        title={`${props.action} product`}
        centered
        size="xl"
        fullScreen={isMobile}
      >
        <ProductForm updateProductData={props.updateProductData} />
      </Modal>
    </>
  );
}

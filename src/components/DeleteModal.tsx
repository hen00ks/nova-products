import { Button, Group, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrashCan } from "react-icons/fa6";
import { redirect, useNavigate } from "react-router-dom";

export default function DeleteModal(props: { productId: string }) {
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["delete-product"],
    mutationFn: () => {
      return fetch(
        `https://test-api.nova-techs.com/products/${props.productId}`,
        {
          method: "DELETE",
        }
      ).then((res) => {
        res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productid", "products"] });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
  });

  const deleteProduct = () => {
    mutation.mutate();
  };

  return (
    <>
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Delete product"
      >
        <h2>Are you sure?</h2>
        <p>this action is irreversible</p>
        <Group justify="end">
          <Button variant="light" color="red" onClick={deleteProduct}>
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
        leftSection={<FaTrashCan />}
      >
        Delete
      </Button>
    </>
  );
}

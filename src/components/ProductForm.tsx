import { Button, Input, NumberInput, Select } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z
    .number({ invalid_type_error: "Price is required" })
    .min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
  use: z.string().min(1, "Use is required"),
  addedBy: z.string().min(1, "Added by is required"),
  quantityOnHand: z.number().min(1, "Quantity must be at least 1"),
  imageUrls: z.array(z.string().url("Must be a valid URL")).optional(),
});

export default function ProductForm({ updateProductData: propsDefaultValues }) {
  const isUpdating = !!propsDefaultValues;
  const queryClient = useQueryClient();

  const defaultValues = propsDefaultValues || {
    name: "",
    description: "",
    category: "",
    tags: "",
    use: "",
    addedBy: "",
    quantityOnHand: 1,
    imageUrls: [],
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationKey: [isUpdating ? "update-product" : "new-product"],
    mutationFn: (formData) => {
      const url = isUpdating
        ? `https://test-api.nova-techs.com/products/${propsDefaultValues.id}`
        : "https://test-api.nova-techs.com/products";

      const method = isUpdating ? "PATCH" : "POST";

      return fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      console.log("Product added successfully");
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error("Error submitting review:", error.message);
    },
  });

  const onSubmit = (data) => {
    const formData = {
      ...data,
      tags: data.tags.split(" ").filter((tag) => tag),
      imageUrls: data.imageUrls.length > 0 ? data.imageUrls : [], // Ensure imageUrls is always an array
      minimumQuantity: 1,
      expiresAt: "2025-02-22T20:51:03.739Z",
      reservedQuantity: 1,
      discount: 1,
    };

    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input.Wrapper label="Product name" error={errors.name?.message}>
        <Input {...register("name")} placeholder="eg: laptop" />
      </Input.Wrapper>
      <Input.Wrapper label="Description" error={errors.description?.message}>
        <Input
          {...register("description")}
          placeholder="eg: 10th gen core i5"
        />
      </Input.Wrapper>
      <Input.Wrapper label="Price" error={errors.price?.message}>
        <Input
          {...register("price", { valueAsNumber: true })}
          placeholder="eg: 52,000"
        />
      </Input.Wrapper>
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <Select
            label="Category"
            placeholder="Pick value"
            error={errors.category?.message}
            data={[
              { value: "clothing", label: "Clothing" },
              { value: "furniture", label: "Furniture" },
              { value: "electronics", label: "Electronics" },
            ]}
            {...field}
          />
        )}
      />
      <Input.Wrapper label="Tags">
        <Input {...register("tags")} placeholder="eg: new" />
      </Input.Wrapper>
      <Controller
        name="use"
        control={control}
        render={({ field }) => (
          <Select
            label="Use"
            placeholder="Pick value"
            error={errors.use?.message}
            data={[
              { value: "for_sale", label: "For Sale" },
              { value: "for_rent", label: "For Rent" },
              { value: "for_use", label: "For Use" },
            ]}
            {...field}
          />
        )}
      />
      <Input.Wrapper label="Added by" error={errors.addedBy?.message}>
        <Input {...register("addedBy")} placeholder="eg: kaleb" />
      </Input.Wrapper>
      <Input.Wrapper
        label="Quantity on hand"
        error={errors.quantityOnHand?.message}
      >
        <Input
          type="number"
          {...register("quantityOnHand", { valueAsNumber: true })}
          placeholder="eg: 123"
        />
      </Input.Wrapper>
      <Input.Wrapper
        label="Image URLs (comma separated)"
        error={errors.imageUrls?.message}
      >
        <Input
          {...register("imageUrls")}
          placeholder="eg: image1.jpg, image2.jpg"
        />
      </Input.Wrapper>
      <Button type="submit" fullWidth>
        {isUpdating ? "Update product" : "Add product"}
      </Button>
    </form>
  );
}

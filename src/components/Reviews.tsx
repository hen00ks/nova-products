import {
  Avatar,
  Button,
  Group,
  Input,
  Paper,
  Rating,
  Stack,
  Textarea,
  Notification,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaPen } from "react-icons/fa6";
import { useState } from "react";

const reviewSchema = z.object({
  reviewerName: z.string().nonempty("Name is required"),
  comment: z.string().nonempty("Comment is required"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
});

export default function Reviews({ productId }) {
  const queryClient = useQueryClient();

  const [notificationVisible, setNotificationVisible] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => {
      return fetch(`https://test-api.nova-techs.com/reviews/${productId}`).then(
        (res) => res.json()
      );
    },
  });

  const mutation = useMutation({
    mutationKey: ["new-review"],
    mutationFn: (formData) => {
      return fetch("https://test-api.nova-techs.com/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      setNotificationVisible(true);
      queryClient.invalidateQueries(["reviews"]);
    },
    onError: (error) => {
      console.error("Error submitting review:", error.message);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      reviewerName: "",
      comment: "",
      rating: 0,
    },
  });

  const onSubmit = (data) => {
    console.log(data);

    mutation.mutate({ ...data, productId });
    reset();
  };

  if (isLoading) return <h2>Loading...</h2>;

  const reviews =
    data?.length !== 0 ? (
      data.map((review) => (
        <Paper key={review.id} shadow="sm" radius="md" p="md">
          <Group>
            <Avatar radius="xl" />
            <h3>{review.reviewerName}</h3>
          </Group>
          <p>{review.comment}</p>
          <Rating value={review.rating} color="dark" readOnly />
        </Paper>
      ))
    ) : (
      <h2>No reviews found</h2>
    );

  return (
    <>
      <Stack h={420} py="md" className="overflow-y-scroll">
        {reviews}
      </Stack>

      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Add your review here</h3>
          <Input.Wrapper label="Name" error={errors.reviewerName?.message}>
            <Input
              {...register("reviewerName")}
              placeholder="e.g., Asrat Tunjo"
            />
          </Input.Wrapper>
          <Textarea
            label="Comment"
            placeholder="Your comment here"
            {...register("comment")}
            error={errors.comment?.message}
            autosize
            maxRows={3}
          />
          {notificationVisible && (
            <Notification
              title="Success"
              color="green"
              onClose={() => setNotificationVisible(false)}
            >
              Your review has been submitted!
            </Notification>
          )}
          <Group justify="space-between" mt={8}>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Rating
                  size="lg"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.rating?.message}
                />
              )}
            />
            <Button type="submit" rightSection={<FaPen />} color="dark">
              Comment
            </Button>
          </Group>
          <p className="text-xs text-red-400">{errors.rating?.message}</p>
        </form>
      </div>
    </>
  );
}

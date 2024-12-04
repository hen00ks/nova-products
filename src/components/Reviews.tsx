import {
  Avatar,
  Box,
  Button,
  Group,
  Input,
  Paper,
  Rating,
  Stack,
  Textarea,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { FaPen } from "react-icons/fa6";
import { useParams } from "react-router-dom";

export default function Reviews({ productId }) {
  const nameRef = useRef();
  const commentRef = useRef();
  const ratingRef = useRef();
  const [rating, setRating] = useState(0);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => {
      return fetch(
        `https://test-api.nova-techs.com/reviews/${productId} `
      ).then((res) => res.json());
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
    onSuccess: (data) => {
      console.log("Review submitted successfully:", data);
      queryClient.invalidateQueries(["reviews"]);
    },
    onError: (error) => {
      console.error("Error submitting review:", error.message);
    },
  });

  if (isLoading) return <h2>Loading...</h2>;

  console.log(data);

  {
    data?.length !== 0 ? <h3>{data.rating}</h3> : <h2>no reviews found</h2>;
  }

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
      <h2>no reviews found</h2>
    );

  function handleForm(e) {
    e.preventDefault();
    const formData = {
      reviewerName: nameRef.current.value,
      comment: commentRef.current.value,
      rating: rating,
      productId: productId,
    };

    // console.log(formData.rating);
    mutation.mutate(formData);
  }

  return (
    <>
      <Stack mih={420} py="md" className="overflow-y-scroll">
        {reviews}
      </Stack>

      <div>
        <form onSubmit={handleForm}>
          <h3>add your review here</h3>
          <Input.Wrapper label="Name">
            <Input ref={nameRef} placeholder="eg: Asrat Tunjo" />
          </Input.Wrapper>
          <Textarea
            label="Comment"
            placeholder="your comment here"
            ref={commentRef}
            autosize
            maxRows={3}
          />
          <Group justify="space-around">
            <Rating onChange={setRating} />
            <Button type="submit" rightSection={<FaPen />} color="dark">
              Comment
            </Button>
          </Group>
        </form>
      </div>
    </>
  );
}

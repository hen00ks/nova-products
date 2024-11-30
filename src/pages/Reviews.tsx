import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

export default function Reviews() {
  const productId = "cm3ta1ihj0002fmf637p13mr8";
  const nameRef = useRef();
  const commentRef = useRef();
  const ratingRef = useRef();

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
        <div key={review.id} style={{ outline: "solid" }}>
          <h3>{review.reviewerName}</h3>
          <h3>{review.rating}</h3>
          <p>{review.comment}</p>
        </div>
      ))
    ) : (
      <h2>no reviews found</h2>
    );

  function handleForm(e) {
    e.preventDefault();
    const formData = {
      reviewerName: nameRef.current.value,
      comment: commentRef.current.value,
      rating: parseInt(ratingRef.current.value),
      productId: productId,
    };

    // console.log(formData);
    mutation.mutate(formData);
  }

  return (
    <div>
      Reviews page
      {reviews}
      <div>
        <form onSubmit={handleForm}>
          <h3>add your review here</h3>
          <label>
            Name:
            <input ref={nameRef} type="text" placeholder="eg: Asrat Tunjo" />
          </label>
          <label>
            Comment:
            <textarea
              ref={commentRef}
              placeholder="your comment here"
              required
            />
          </label>
          <label>
            Rating:
            <input
              ref={ratingRef}
              type="number"
              min={1}
              max={5}
              placeholder="rate through 1 to 5"
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

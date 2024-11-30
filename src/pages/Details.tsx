import { useQuery } from "@tanstack/react-query";

export default function Details() {
  const productId = "cm3ta1ihj0002fmf637p13mr8";
  const { data, isLoading } = useQuery({
    queryKey: ["productid"],
    queryFn: () => {
      return fetch(
        `https://test-api.nova-techs.com/products/${productId}`
      ).then((res) => res.json());
    },
  });

  //   console.log(data);

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>Details</h1>
      <div>
        <h2>{data.name}</h2>
        <h2>{data.price}</h2>
        <h2>{data.discount}%</h2>
        <h2>{data.description}</h2>
        <h2>created at:{data.createdAt}</h2>
        <h2>expires on:{data.expiresAt}</h2>
        <h2>{data.addedBy}</h2>
        <h2>
          {data.use.split("_").map((word) => (
            <span>{word} </span>
          ))}
        </h2>
      </div>
      <div>
        <button>reviews</button>
        <div>
          <button>Update</button>
          <button>Delete</button>
        </div>
      </div>
    </div>
  );
}

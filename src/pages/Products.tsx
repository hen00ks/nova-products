import { useQuery } from "@tanstack/react-query";

export default function Products() {
  const { data: productsObject, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      fetch("https://test-api.nova-techs.com/products").then((res) =>
        res.json()
      ),
  });

  if (isLoading) return <h2>Loading...</h2>;

  console.log(productsObject);

  const reacted = productsObject?.data.map((product, i) => {
    return (
      <div key={product.id}>
        <img src={product.imageUrls[0]} alt="product image" />
        <h3>{product.name}</h3>
        <h2>{product.price}</h2>
        <p>{product.use}</p>
      </div>
    );
  });

  return <div>{reacted}</div>;
}

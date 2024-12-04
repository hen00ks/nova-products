import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Text,
} from "@mantine/core";
import classes from "./ProductCard.module.css";

export default function ProductCard(props) {
  const features =
    props.tags.length === 0 ? (
      <Badge variant="light">No tags</Badge>
    ) : (
      props.tags.map((badge, i) => (
        <Badge variant="light" key={i}>
          {badge}
        </Badge>
      ))
    );

  return (
    <Card
      shadow="md"
      className="size-[422px]"
      radius="md"
      p="md"
      style={{ aspectRatio: "1" }}
    >
      <Card.Section className="h-40">
        <Image
          src={props.imageUrls[0]}
          alt={props.productName}
          className="h-full object-contain"
        />
      </Card.Section>

      <Card.Section p="md" pt={0} mt="md">
        <Group justify="apart">
          <Text fz="lg" fw={500}>
            {props.productName}
          </Text>
          <Badge size="sm" variant="light">
            {props.use}
          </Badge>
        </Group>
        <Text fz="sm" mt="xs" className="line-clamp-2 min-h-11">
          {props.description}
        </Text>
        <Text fz="xl" fw={700}>
          ETB {props.price}
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Group gap={7} mt={5}>
          {features}
        </Group>
      </Card.Section>

      <Group mt="xs">
        <Button radius="md" color="dark.7" fullWidth>
          Show details
        </Button>
      </Group>
    </Card>
  );
}

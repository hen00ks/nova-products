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
import { FaRegHeart } from "react-icons/fa6";

const mockdata = {
  image:
    "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
  title: "Verudela Beach",
  country: "Croatia",
  description:
    "Completely renovated for the season 2020, Arena Verudela Bech Apartments are fully equipped and modernly furnished 4-star self-service apartments located on the Adriatic coastline by one of the most beautiful beaches in Pula.",
  badges: [
    { emoji: "☀️", label: "Sunny weather" },
    { emoji: "🦓", label: "Onsite zoo" },
    { emoji: "🌊", label: "Sea" },
    { emoji: "🌲", label: "Nature" },
    { emoji: "🤽", label: "Water sports" },
  ],
};

export default function ProductCard(props) {
  const { image, title, description, country, badges } = mockdata;

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
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image src={props.imageUrls[0]} alt={title} height={180} />
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group justify="apart">
          <Text fz="lg" fw={500}>
            {props.productName}
          </Text>
          <Badge size="sm" variant="light">
            {props.use}
          </Badge>
          <Text fz="lg" fw={500}>
            {props.price}
          </Text>
        </Group>
        <Text fz="sm" mt="xs">
          {props.description}
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        {/* <Text mt="md" className={classes.label} c="dimmed">
          Perfect for you, if you enjoy
        </Text> */}
        <Group gap={7} mt={5}>
          {features}
        </Group>
      </Card.Section>

      <Group mt="xs">
        <Button radius="md" style={{ flex: 1 }}>
          Show details
        </Button>
        {/* <ActionIcon variant="default" radius="md" size={36}>
          <FaRegHeart className={classes.like} />
        </ActionIcon> */}
      </Group>
    </Card>
  );
}

import { Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./HeaderSearch.module.css";
import { Button } from "@mantine/core";
import { FaPlus } from "react-icons/fa6";
const links = [
  { link: "/about", label: "Features" },
  { link: "/pricing", label: "Pricing" },
  { link: "/learn", label: "Learn" },
  { link: "/community", label: "Community" },
];

export default function Header() {
  //   const [opened, { toggle }] = useDisclosure(false);

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          {/* <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" /> */}
          <Group>
            <img src="/logo.png" alt="logo" height={28} />
            <img src="/logo-name.png" alt="logo" height={28} />
          </Group>
        </Group>
        <h5 className={classes.h5}>Products page</h5>
      </div>
    </header>
  );
}

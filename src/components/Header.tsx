import { Burger, Group } from "@mantine/core";
import classes from "./HeaderSearch.module.css";

export default function Header({ page }) {
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
        <h5 style={{ margin: "0 auto" }}>{page} page</h5>
      </div>
    </header>
  );
}

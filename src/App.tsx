// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

export default function App() {
  return <MantineProvider>App</MantineProvider>;
}

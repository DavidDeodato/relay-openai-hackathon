import type { Metadata } from "next";
import RelayApp from "./relay-app-v2";

export const metadata: Metadata = {
  title: "Relay — contexto que vira ação",
  description:
    "A mente operacional compartilhada para equipes que precisam decidir sem perder a fonte.",
};

export default function Home() {
  return <RelayApp />;
}

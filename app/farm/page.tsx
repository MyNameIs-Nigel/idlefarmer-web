import type { Metadata } from "next";
import { siteConfig } from "../site";
import FarmCabinet from "./FarmCabinet";

const title = "Farm";
const description =
  "Farm is the first cabinet on the SSH-Arcade floor: a cozy idle farming game that lives in your terminal. Plant, walk away, and come home richer — try the playable field, then copy one SSH command to play for real.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/farm" },
  openGraph: {
    type: "website",
    title: `${title} | ${siteConfig.name}`,
    description,
    url: `${siteConfig.url}/farm`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteConfig.name}`,
    description,
  },
};

export default function FarmPage() {
  return <FarmCabinet />;
}

import { Footer, Nav } from "@/components/Nav";
import { Collection } from "@/components/sections/Collection";
import { Details } from "@/components/sections/Details";
import { Hero } from "@/components/sections/Hero";
import { Lookbook } from "@/components/sections/Lookbook";
import { Packaging } from "@/components/sections/Packaging";
import { Postcard } from "@/components/sections/Postcard";
import { Silhouette } from "@/components/sections/Silhouette";
import { Specs } from "@/components/sections/Specs";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Silhouette />
        <Postcard />
        <Details />
        <Packaging />
        <Collection />
        <Lookbook />
        <Specs />
      </main>
      <Footer />
    </>
  );
}

import { DetailView } from "@/components/DetailView";
import { Journey } from "@/components/Journey";
import { Footer, Nav } from "@/components/Nav";
import { Packaging } from "@/components/Packaging";
import { Product } from "@/components/Product";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Journey />
        <Packaging />
        <Product />
      </main>
      <Footer />
      <DetailView />
    </>
  );
}

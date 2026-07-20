import { ContentDeck } from "@/components/ContentDeck";
import { Footer } from "@/components/Footer";
import { GeometricBackdrop } from "@/components/GeometricBackdrop";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="page-shell relative isolate min-h-svh">
      <GeometricBackdrop />
      <div className="relative z-10 flex min-h-svh flex-col">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <ContentDeck />
        </main>
        <Footer />
      </div>
    </div>
  );
}

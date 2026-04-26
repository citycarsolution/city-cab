import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import About from "./components/About";
import FAQ from "./components/FAQ";
import Blog from "./components/Blog";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-white">

      {/* HEADER */}
      <Header />

      {/* 🔥 CONTENT */}
      <div className="pt-14 pb-16">

        <Hero />

        <Services />

        <About />

        <FAQ />

        <Blog />

      </div>

      {/* FOOTER */}
      <Footer />

    </main>
  );
}
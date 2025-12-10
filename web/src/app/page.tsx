import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
// import SearchCard from "./components/SearchCard";
import Footer from "./components/Footer";
import Destination from "./components/Destination";
import ChooseUs from "./components/ChooseUs";
import Testimoni from "./components/Testimoni";
import InputTestimoni from "./components/InputTestimoni";

export default function Home() {
  
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-black">
    { /* Navbar */ }
      <NavBar />


      {/* Hero Section */}
      <section>
        <Hero />
      </section>

      <section>
        <Destination />
      </section>

       <section>
        <ChooseUs />
      </section>

      <section>
       <Testimoni/>
      </section>

      <section>
        <InputTestimoni />
      </section>

      {/* Search Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        {/* <SearchCard /> */}
      </section>

    {/* footer */}
    <Footer />

    </main>
  );
}

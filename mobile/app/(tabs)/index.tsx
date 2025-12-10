import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Platform, ScrollView } from 'react-native';
// import Hero from "@/app/compo/Hero";
// import Destinasi from "@/app/compo/Destinasi";
// import ChooseUs from "@/app/compo/ChooseUs";
// import Testimoni from "@/app/compo/Testimoni";
// import InputTestimoni from "@/app/compo/InputTestimoni";
// import Footer from "@/app/compo/Footer";
import Landingpage from "@/app/components/Landingpage";
import NavBar from "@/app/components/NavBar";

export default function HomeScreen() {
  return (
    <ScrollView>
      <NavBar/>
      {/* <Hero />
      <Destinasi />
      <ChooseUs />
      <Testimoni user={undefined} />
      <InputTestimoni /> */}
      <Landingpage/>
      {/* <Footer /> */}
    </ScrollView>
  );
}


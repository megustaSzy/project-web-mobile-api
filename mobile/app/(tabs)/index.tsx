import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Platform, ScrollView } from 'react-native';
import Hero from "@/app/components/Hero";
import Destinasi from "@/app/components/Destinasi";
import ChooseUs from "@/app/components/ChooseUs";
import Testimoni from "@/app/components/Testimoni";
import InputTestimoni from "@/app/components/InputTestimoni";
import Footer from "@/app/components/Footer";


export default function HomeScreen() {
  return (
    <ScrollView>
      <Hero />
      <Destinasi />
      <ChooseUs />
      <Testimoni user={undefined} />
      <InputTestimoni />
      <Footer />
    </ScrollView>
  );
}


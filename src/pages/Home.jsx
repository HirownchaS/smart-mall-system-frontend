import { useState } from 'react'
import Hero from "../components/Hero/Hero";
import Products from "../components/Products/Products";
import TopProducts from "../components/TopProducts/TopProducts";
import Banner from "../components/Banner/Banner";
import Subscribe from "../components/Subscribe/Subscribe";
import Testimonials from "../components/Testimonials/Testimonials";
import Stores from '../components/Store/Stores';

const Home = () => {

  return (
    <div>
      <Hero />
      <Stores/>
      <Testimonials />
    </div>
  )
}

export default Home
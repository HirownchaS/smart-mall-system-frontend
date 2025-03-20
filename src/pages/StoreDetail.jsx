import React from 'react'
import StoresDetail from '../components/Store/StoresDetail'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import { useParams } from 'react-router-dom'

function StoreDetail() {

  const id = useParams();
  return (
    <>
    <StoresDetail />
    </>
  )
}

export default StoreDetail;
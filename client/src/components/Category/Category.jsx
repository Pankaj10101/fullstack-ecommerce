import React from 'react'
import './Category.scss'
import Products from '../Products/Products'

import {useParams} from 'react-router-dom'
import useFetch from '../../Hooks/useFetch'

const Category = () => {

  const {id} = useParams();

  const {data} = useFetch(`/api/products?populate=*&[filters][categories][id]=${id}`)
  console.log(data)
  return (
    <section  id='category-section'>
    <div className="category-main-content">
    <div className="layout">
      <div className="category-title">
      {data?.data?.[0]?.attributes?.categories?.data?.[0]?.attributes?.title}
      </div>
      <Products innerPage = {true} products={data}/>
      
    </div>
    </div>
    </section>
  )
}

export default Category
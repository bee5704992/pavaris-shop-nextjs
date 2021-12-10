import { getData } from '../utils/fetchData'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import Head from 'next/head'
import ProductItem from '../components/product/ProductItem'
import filterSearch from '../utils/filterSearch'
import Filter from '../components/Filter'
import {useRouter} from 'next/router'

const Home = (props) => {
  const [products, setProducts] = useState(props.productProps)
  const [isCheck, setIsCheck] = useState(false)
  const [page, setPage] = useState(1)
  const { state, dispatch } = useContext(DataContext)

  const { auth } = state

  const router = useRouter()
  

  useEffect(()=>{
    setProducts(props.productProps)
  },[props.productProps])

  useEffect(()=>{
    if(Object.keys(router.query).length === 0) setPage(1)
    
  },[router.query])
  
  const handleCheck = (id) => {
    products.forEach(product => {
      if (product._id === id) product.checked = !product.checked
    })
    setProducts([...products])
  }

  const handleCheckAll = () => {
    products.forEach(product => product.checked = !isCheck)
    setProducts([...products])
    setIsCheck(!isCheck)
  }

  const handleDeleteAll = () => {
    let deleteArr = [];
    products.forEach(product => {
      if(product.checked){
        deleteArr.push({
            type: 'DELETE_PRODUCT', data: product, id: product._id,
            title: 'Delete all selected products?', bodytext: 'Do you want to delete all products?'
        })
      }
    })

    dispatch({
      type: 'ADD_MODAL',
      payload: deleteArr
    })
  }

  const handleLoadmore = () => {
    setPage(page + 1)
    filterSearch({router, page: page + 1})
  }

  return (
    <div className="home_page">
      <Head>
        <title>Home page</title>
      </Head>

      <Filter state={state} />

      {
        auth.user?.role === 'admin' &&
        <div className="delete_all btn btn-danger mt-2" style={{ marginBottom: '-10px' }}>
          <input type="checkbox" checked={isCheck} onChange={handleCheckAll}
            style={{ width: '25px', height: '25px', transform: 'translateY(8px)' }} />
            <button className="btn btn-danger ml-2"
            data-toggle="modal" data-target="#exampleModal"
            onClick={handleDeleteAll}>
              DELETE ALL
            </button>
        </div>
      }

      <div className="products">
        {
          products.length === 0 ? <h2>No Products</h2> :
            products.map((product) => (
              <ProductItem key={product._id} product={product} handleCheck={handleCheck} />
            ))
        }
      </div>

      {
        props.result < page * numLoadProducts ? ''
        : <button className="btn btn-outline-info d-block mx-auto mb-4"
        onClick={handleLoadmore}>
          Load more
        </button>
      }
    </div>
  )
}

const numLoadProducts = 6;

export async function getServerSideProps({query}) {
  const page = query.page || 1
  const category = query.category || 'all'
  const sort = query.sort || ''
  const search = query.search || 'all'

  const res = await getData(`product?limit=${page * numLoadProducts}&category=${category}&sort=${sort}&title=${search}`)

  return {
    props: {
      productProps: res.products,
      result: res.result
    }, // will be passed to the page component as props
  }
}

export default Home

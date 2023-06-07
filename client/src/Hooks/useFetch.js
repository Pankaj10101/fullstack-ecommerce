import { useEffect, useState } from "react";

import {fetchDataFromApi} from '../store/api'


const useFetch = (endPoint)=>{
    const [data, setData] = useState()

    useEffect(()=>{
        makeApiCall()
    }, [endPoint])

    const makeApiCall = async () =>{
        const res = await fetchDataFromApi(endPoint)
        setData(res)
    }

    return {data}
}


export default useFetch
import React, { useEffect, useState } from 'react'
import axios from 'axios'

function useFetch(url) {
    const [ data, setData ] = useState(null)
    const [ error, setError ] = useState(null)

    useEffect(() => {
        axios.get(url).then((response) => {
            setData(response.data);
        }).catch((err) => {
            setError(err);
        })
    }, [url]);


    return { data, loading, error };
}

export default useFetch
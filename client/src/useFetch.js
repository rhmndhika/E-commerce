import axios from 'axios'

const BASE_URL = "http://localhost:5000";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MzBlY2I5YWRiYmY3NjU3OTBkZmFiNSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY4MTYyNzE4NCwiZXhwIjoxNjgxODg2Mzg0fQ.eeAaH9CX0pMrM9MK1FGQu02SwrPV51Zc075C8M-T9vI"

export const publicRequest = axios.create({
    baseURL: BASE_URL
})

export const userMethod = axios.create({
    baseURL: BASE_URL,
    headers: {token: `Bearer ${TOKEN}`}
})




// import React, { useEffect, useState } from 'react'
// import axios from 'axios'

// function useFetch(url) {
//     const [ data, setData ] = useState(null)
//     const [ loading, setLoading ] = useState(false)
//     const [ error, setError ] = useState(null)

//     useEffect(() => {
//         setLoading(true);
//         axios.get(url).then((response) => {
//             setData(response.data);
//         }).catch((err) => {
//             setError(err);
//         }).finally(() => {
//             setLoading(false);
//         })
//     }, [url]);

//     const refetch = () => {
//         setLoading(true);
//         axios.get(url).then((response) => {
//             setData(response.data);
//         }).catch((err) => {
//             setError(err);
//         }).finally(() => {
//             setLoading(false);
//         })
//     }

//     return { data, loading, error, refetch };
// }

// export default useFetch
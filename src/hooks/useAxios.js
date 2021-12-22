import { useState, useEffect} from 'react';
import axios from 'axios';

// hook flexible para fetch de api
const useAxios = (url) =>{
    const [res, setRes] = useState(null);
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        axios.get(url).then((res) => {
            setRes(res.data);
        }).catch((err)=>{
            setErr(err);
        }).finally(()=>{
            setLoading(false);
        });
    }

    useEffect(()=>{
       fetchData(); 
    }, [url]);

    return {res, err, loading};
};

export default useAxios;
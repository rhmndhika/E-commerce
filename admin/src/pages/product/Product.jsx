import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, Redirect } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart"
import {productData} from "../../dummyData"
import { Publish } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux"; 
import { updateProduct } from "../../redux/apiCalls";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../firebase";
import { userMethod } from "../../useFetch";

export default function Product() {

  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  const [ productStats, setProductStats ] = useState([]);
  const [ inputs, setInputs ] = useState({});
  const [ file, setFile ] = useState(null);
  const [ cat, setCat ] = useState([]);
  const dispatch = useDispatch();

  const product = useSelector((state) =>
    state.product.products.find((product) => product._id === productId)
  );
  
  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }
  
  const handleCat = (e) => {
    setCat(e.target.value.split(","));
  }

 
  useEffect(() => {
    if (cat.length === 0) {
      setCat(product.categories);
    }
  }, [])

  
  const handleClick = (e) => {
    e.preventDefault();
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const StorageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(StorageRef, file);

     // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const product = { ...inputs, img: downloadURL, categories: cat };
          // addProduct(dispatch, product);
          updateProduct(dispatch, product, productId);
          setTimeout(window.location.reload(), 2000);
        });
      }
    );
  }

    const MONTHS = useMemo(
        () => [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Agu",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        []
    );

    useEffect(() => {
        const getStats = async () => {
          try {
            const res = await userMethod.get("orders/income?pid=" + productId);
            const list = res.data.sort((a,b)=>{
                return a._id - b._id
            })
            list.map((item) =>
              setProductStats((prev) => [
                ...prev,
                { name: MONTHS[item._id - 1], Sales: item.total },
              ])
            );
          } catch (err) {
            console.log(err);
          }
        };
        getStats();
      }, [productId, MONTHS])

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
        <Link to="/newproduct">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      { product && 
      <>
      <div className="productTop">
          <div className="productTopLeft">
              <Chart data={productStats} dataKey="Sales" title="Sales Performance"/>
          </div>
          <div className="productTopRight">
              <div className="productInfoTop">
                <img src={product.img} alt="img" className="productInfoImg" />
                <span className="productName">{product.title}</span>
              </div>
              <div className="productInfoBottom">
                  <div className="productInfoItem">
                      <span className="productInfoKey">id:</span>
                      <span className="productInfoValue">{product._id}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">sales:</span>
                      <span className="productInfoValue">5123</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">in stock:</span>
                      <span className="productInfoValue">{product.inStock}</span>
                  </div>
              </div>
          </div>
      </div>
      <div className="productBottom">
          <form className="productForm">
              <div className="productFormLeft">
                  <label>Product Name</label>
                  <input name="title" type="text" placeholder={product.title} onChange={handleChange} />
                  <label>Product Descriiption</label>
                  <input name="desc" type="text" placeholder={product.desc} onChange={handleChange} />
                  <label>Price</label>
                  <input name="price" type="text" placeholder={product.price} onChange={handleChange} />
                  <label>Categories</label>
                  <input type="text" placeholder={product.categories} onChange={handleCat} />
                  <label>Materials</label>
                  <select name="materials" onChange={handleChange}>
                    <option selected disabled>{product.materials}</option>
                    <option value="">None</option>
                    <option value="Rubber">Rubber</option>
                    <option value="Polyurethane">Polyurethane</option>
                    <option value="Metal">Metal</option>
                    <option value="Plastic">Plastic</option>
                  </select>
                  <label>In Stock</label>
                  <select name="inStock" id="idStock" onChange={handleChange}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
              </div>
              <div className="productFormRight">
                  <div className="productUpload">
                      <img src={product.img} alt="" className="productUploadImg" />
                      <label for="file">
                        <Publish/>
                      </label>
                      <input type="file" id="file" style={{display:"none"}} 
                        onChange={(e) => setFile(e.target.files[0])} />
                  </div>
                  <button onClick={handleClick} className="productButton">Update</button>
              </div>
          </form>
      </div>
    </>
    }
    </div>
  );
}

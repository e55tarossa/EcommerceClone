import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Fragment, useEffect, useState } from "react";
import { routes } from "./routes/index";
import axios from "axios";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { useQuery } from "@tanstack/react-query";
import { isJsonString } from "./ultils";
import jwt_decode from "jwt-decode";
import * as UserService from "./services/UserService";
import { updateUser } from "./redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./components/LoadingComponent/Loading";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector(state => state.user)

  useEffect(() => {
    setIsLoading(true)
    const { decoded, storageData } = handleDecoded();
    // console.log(decoded, storageData) // token dc decoded voi token 
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
    setIsLoading(false)
  }, []);



  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwt_decode(storageData); // exp, payload: {id: '638dae7dd1dde71a98acbc8d', isAdmin: true}
    }
    return { decoded, storageData };
  };

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    // console.log("axiox interceptor 1")
    // Do something before request is sent
    const currentTime = new Date()
    const { decoded } = handleDecoded()
    if (decoded?.exp < currentTime.getTime() / 1000) {
      const data = await UserService.refreshToken()
      config.headers['token'] = `Bearer ${data?.access_token}`
    }
    return config;
  }, (err) => {
    return Promise.reject(err)
  })

  // useEffect(()=> {
  //   fetchAPI()
  // },[])

  // const fetchAPI = async () => {
  //   const res = await axios.get(`http://localhost:3001/api/product/get-all`)
  //   return res.data
  // }

  // const query = useQuery({ queryKey: ['products'], queryFn: fetchAPI})
  // console.log(query);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  return (
    <div className="App">
      <Loading isLoading={isLoading}>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const isCheckAuth = !route.isPrivate || user.isAdmin
            const Layout = route.isShowHeader ? DefaultComponent : Fragment;
            return (
              <Route
                path={isCheckAuth && route.path}
                key={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
      </Loading>
    </div>
  );
}

export default App;

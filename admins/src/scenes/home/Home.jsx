import React, { useState, useEffect, useMemo } from "react";
import "./Home.css";
import { userRequest } from "../../useFetch";
import Sidebar from "../../components/Sidebar/Sidebar.tsx";
import Chart from "../../components/Chart/Chart";
import FeaturedInfo from "../../components/FeaturedInfo/FeatureInfo";
import WidgetSm from "../../components/Widget/WidgetSm";
import WidgetLg from "../../components/Widget/WidgetLg";
import { Flex } from "@chakra-ui/react";

export default function Home() {

  const [ userStats, setUserStats ] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
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
        const res = await userRequest.get("/users/stats");
        res.data.map((item) =>
          setUserStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], "Active User": item.total },
          ])
        );
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, [MONTHS]);

  useEffect(() => {
    const makeCartRequest = async () => {
        try{
            const response = await userRequest.get('/notification')
            setNotifications(response.data)
        } catch (err) {
            console.log(err);
        } 
    }
    makeCartRequest();
}, [])

  return (
    <Sidebar>
    <div className="home">
      <FeaturedInfo />
      <Chart data={userStats} title="User Analytics" grid dataKey="Active User"/>
      <Flex m="20px" flexWrap="wrap">
        <WidgetSm />
        <WidgetLg />
      </Flex>
    </div>
    </Sidebar>
  );
}

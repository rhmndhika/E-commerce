import React, { useState, useEffect } from "react";
import { userRequest } from "../../useFetch";
import moment from 'moment'
import "./WidgetLg.css";
import { Link } from "react-router-dom";

export default function WidgetLg() {
  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };

  const [ orders, setOrders ] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await userRequest.get("/order/all/?new=true")
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getOrders();
  }, [])
  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest transactions</h3>
      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Order ID</th>
          <th className="widgetLgTh">Customer</th>
          <th className="widgetLgTh">Date</th>
          <th className="widgetLgTh">Amount</th>
          <th className="widgetLgTh">Status</th>
        </tr>
        { orders.slice(0, 8).map((order) => (
        <tr className="widgetLgTr" key={order._id}>
          <Link to={`/transaction/detail/${order._id}`}>
            <td className="widgetLgUser">
              <span className="widgetLgName">{order._id}</span>
            </td>
          </Link>
          <td className="widgetLgAmount">{order.userId.username}</td>
          <td className="widgetLgDate">{moment(order?.createdAt).startOf('hour').fromNow()}</td>
          <td className="widgetLgAmount">{order.amount}</td>
          <td className="widgetLgStatus">
            <Button type={order.status} />
          </td>
        </tr>
        ))}
      </table>
    </div>
  );
}

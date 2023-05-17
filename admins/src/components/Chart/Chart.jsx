import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import './Chart.css'
import { Text } from "@chakra-ui/react";

export default function Chart({ title, data, dataKey, grid }) {

  return (
    <div className="chart">
      { data.length > 0 ? 
      <div>
      <h3 className="chartTitle">{title}</h3>
      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#5550bd" />
          <Line type="monotone" dataKey={dataKey} stroke="#5550bd" />
          <Tooltip />
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
        </LineChart>
      </ResponsiveContainer>
      </div>
      :
      <Text as="b" fontSize="xl">The product has not yet been sold</Text>
      }
    </div>
  );
}

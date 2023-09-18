import { Tooltip } from "antd";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import PropTypes from "prop-types";

const AreaGraph = ({ data }) => {
  const renderCustomLabel = (value) => {
    if (value === "totalRequests") {
      return "Total Requests";
    } else if (value === "closedRequests") {
      return "Closed Requests";
    }
    return value;
  };

  const formatDate = (dateString) => {
    // Assuming dateString is in the format "YYYY-MM-DD"
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" }); // Get short month name
    const day = date.getDate();
    return `${month} ${day}`;
  };

  return (
    <ResponsiveContainer width="100%" height="80%">
      <AreaChart
        width="100%"
        height="90%"
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="totalRequests" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="closedRequests" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tickFormatter={formatDate} />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Legend align="right" formatter={renderCustomLabel} />

        <Tooltip />
        <Area
          type="monotone"
          dataKey="totalRequests"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#totalRequests)"
        />
        <Area
          type="monotone"
          dataKey="closedRequests"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#closedRequests)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

AreaGraph.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AreaGraph;

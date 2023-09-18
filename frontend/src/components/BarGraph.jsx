import { Tooltip } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import PropTypes from "prop-types";

const BarGraph = ({ data }) => {
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
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate} // Format the tick values using formatDate function
        />
        <YAxis />
        <Tooltip />
        <Legend align="right" formatter={renderCustomLabel} />
        <Bar
          dataKey="totalRequests"
          name="Total Requests"
          fill="#8884d8"
          barSize={30}
        />
        <Bar
          dataKey="closedRequests"
          name="Closed Requests"
          fill="#82ca9d"
          barSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

BarGraph.propTypes = {
  data: PropTypes.array.isRequired, // Assuming data is an array of objects
};

export default BarGraph;

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import PropTypes from "prop-types";

const COLORS = ["#8884d8", "#82ca9d"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload) {
    const closedValue = payload[0].value;
    const unclosedValue = payload[1].value;
    let performanceMessage = "";

    if (closedValue > unclosedValue) {
      performanceMessage = (
        <span className="text-green-500">Excellent Performance</span>
      );
    } else if (closedValue === unclosedValue) {
      performanceMessage = (
        <span className="text-yellow-500">Good Performance</span>
      );
    } else if (closedValue >= 1 && unclosedValue > closedValue) {
      performanceMessage = (
        <span className="text-orange-500">Average Action</span>
      );
    } else {
      performanceMessage = <span className="text-red-500">Take Action</span>;
    }

    return (
      <div className="bg-white border border-gray-300 p-3 rounded shadow-lg">
        <p className="font-bold mb-2">{`${label}`}</p>
        <p className="">{`Closed: ${closedValue}`}</p>
        <p className="mb-2">{`Unclosed: ${unclosedValue}`}</p>
        <p className="font-bold">{performanceMessage}</p>
      </div>
    );
  }

  return null;
};

const BarGraph = ({
  data,
  values1,
  values2,
  xValue,
  windowsHeight768,
  isLargeScreen,
}) => {
  const formatDate = (dateString) => {
    // Assuming dateString is in the format "YYYY-MM-DD"
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" }); // Get short month name
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const nameFormat = (name) => {
    const fullNameArray = name.split(" ");
    const lastName = fullNameArray[fullNameArray.length - 1];
    return lastName;
  };

  const formatter = (value) => {
    return <span className="text-lg text-black">{value}</span>;
  };

  return (
    <ResponsiveContainer width={"100%"} height={windowsHeight768 ? 200 : 330}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        {isLargeScreen ? (
          <XAxis
            tick={{
              fontSize: isLargeScreen ? "1.125rem" : "0.95rem",
              lineHeight: isLargeScreen ? "1.75rem" : "1.45rem",
            }}
            interval={0}
            height={40}
            dataKey={xValue}
            {...(xValue === "date"
              ? { tickFormatter: formatDate }
              : { tickFormatter: nameFormat })}
          />
        ) : (
          <XAxis
            tick={{
              fontSize: isLargeScreen ? "1.125rem" : "0.95rem",
              lineHeight: isLargeScreen ? "1.75rem" : "1.45rem",
            }}
            interval={0}
            height={40}
            dataKey={xValue}
            {...(xValue === "date"
              ? { tickFormatter: formatDate }
              : { tickFormatter: nameFormat })}
            angle={-20}
            textAnchor="end"
          />
        )}

        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          align="right"
          formatter={formatter}
          wrapperStyle={{ fontSize: "1.225rem" }}
        />
        <Bar dataKey={values1} name="Closed" fill={COLORS[0]} barSize={30} />
        <Bar dataKey={values2} name="Unclosed" fill={COLORS[1]} barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
};

BarGraph.propTypes = {
  data: PropTypes.any,
  values1: PropTypes.any.isRequired,
  values2: PropTypes.any.isRequired,
  xValue: PropTypes.any.isRequired,
  windowsHeight768: PropTypes.bool.isRequired,
  isLargeScreen: PropTypes.bool,
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
};

export default BarGraph;

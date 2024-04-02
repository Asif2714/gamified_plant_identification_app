import React from "react";
import { View } from "react-native";
import { Svg, Polygon, Text, Line, G } from "react-native-svg";

//  This code is implemented while modifying the code to suit for react native
// from https://dev.to/simbamkenya/building-spider-chart-with-d3-js-and-react-js-50pj

const RadarChart = ({ metrics, size = 180 }) => {
    // Destructuring the key-value pairs we sent fron the challenges screen
    const keys = Object.keys(metrics);
    const values = Object.values(metrics);

    // Setting up the dimensions for the spider graph
    const numVertices = keys.length;
    const angle = (Math.PI * 2) / numVertices;
    const radius = size / 2;
    const padding = 60; 
    const chartSize = size + padding * 2;

    // Caclulating the points for the values in polygon vertex
    const points = values
    .map((value, index) => {
      const x = radius * value * Math.cos(angle * index - Math.PI / 2);
      const y = radius * value * Math.sin(angle * index - Math.PI / 2);
      return `${x},${y}`;
    })
    .join(" ");

    // Axislines which comes from centre to the outward points in the chart
    const axisLines = keys.map((key, index) => {
        const x = radius * Math.cos(angle * index - Math.PI / 2);
        const y = radius * Math.sin(angle * index - Math.PI / 2);
        return { x, y };
  });

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Svg height={chartSize} width={chartSize}>
        {/* Grouping the svg elements and applying the translate to move it to center */}
        <G translate={`${chartSize / 2}, ${chartSize / 2}`}>
            {/* Drawing axislines from origin 0,0 */}
          {axisLines.map((line, index) => (

            <Line
              key={`line_${index}`}
              x1={0}
              y1={0}
              x2={line.x}
              y2={line.y}
              stroke="gray"
              strokeWidth="1"
            />
          ))}

            {/* Filling the poligon */}
          <Polygon
            points={points}
            fill="rgba(0, 150, 0, 0.4)"
            stroke="green"
            strokeWidth="2"
          />

          {/* Putting the text values, the key is the text */}
          {keys.map((key, index) => {
            const x = (radius + 20) * Math.cos(angle * index - Math.PI / 2);
            const y = (radius + 20) * Math.sin(angle * index - Math.PI / 2);
            const alignment = { textAnchor: "middle" };
            if (index === 0) alignment.textAnchor = "start"; 
            if (index === numVertices / 2) alignment.textAnchor = "end"; 
            return (
              <Text
                key={`key_${index}`}
                x={x}
                y={y}
                fontSize="15"
                fill="#000"
                textAnchor={alignment.textAnchor}
                alignmentBaseline="middle"
              >
                {key}
              </Text>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

export default RadarChart;

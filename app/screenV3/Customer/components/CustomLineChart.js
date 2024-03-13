import { ScrollView, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { AreaChart, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { Defs, G, LinearGradient, Stop, Text } from 'react-native-svg';
import { Path } from 'react-native-svg';
import { Line } from 'react-native-svg';
import Colors from '../../../theme/Color';
import { Rect } from 'react-native-svg';
import { Circle } from 'react-native-svg';

const widthItemChart = 75;

const contentInset = { top: 18, bottom: 33, left: 25, right: 25 };

const CustomLineChart = (props) => {
  const { data = [], dataLabel = [], labelHideDecimal } = props;
  const [selected, setSelected] = useState();

  const maxValue = useMemo(() => {
    if (!data?.length) return 0;
    let value = data[0];
    data.forEach((number) => {
      if (number > value) {
        value = number;
      }
    });
    return value;
  }, [data]);
  const minValue = useMemo(() => {
    if (!data?.length) return 0;
    let value = data[0];
    data.forEach((number) => {
      if (number < value) {
        value = number;
      }
    });
    return value;
  }, [data]);

  const Gradient = () => (
    <Defs key={'gradient'}>
      <LinearGradient id={'gradient'} x1={'0'} y1={'100%'} x2={'0'} y2={'50%'}>
        <Stop offset={'100%'} stopColor={'rgb(153, 191, 255)'} stopOpacity={1} />
        <Stop offset={'0%'} stopColor={'rgb(153, 191, 255)'} stopOpacity={0.5} />
      </LinearGradient>
    </Defs>
  );

  const Tooltip = ({ x, y }) => {
    const totalPaddingHorizontal = 24;
    const widthOneNumber = 10;
    const height = 28;
    const width =
      totalPaddingHorizontal + JSON.stringify(data?.[selected?.index]).length * widthOneNumber;
    let yToolTip = y(data?.[selected?.index] || 0);
    const yMaxValue = y(maxValue);
    const yMinValue = y(minValue);
    const yExpand = height + 15;

    if (yToolTip === yMinValue || yToolTip > yMaxValue + yExpand) {
      yToolTip -= yExpand;
    } else {
      yToolTip += 15;
    }

    return (
      <G x={x(selected?.index) - width / 2} key={'tooltip'}>
        <G y={yToolTip}>
          <Rect height={height} width={width} fill={Colors.primary2} ry={15} rx={15} />
          <Text
            x={width / 2}
            dy={height / 2}
            y={1}
            alignmentBaseline={'middle'}
            textAnchor={'middle'}
            stroke={Colors.primary5}
            fontSize={16}
            fontWeight={'100'}
          >
            {`${data?.[selected?.index]}`}
          </Text>
        </G>
        <G x={width / 2}>
          <Circle
            cy={y(data?.[selected?.index]) || 0}
            r={6}
            stroke={Colors.primary5}
            strokeWidth={2}
            fill={Colors.primary2}
          />
        </G>
      </G>
    );
  };

  const CustomGrid = ({ x, y, data: dataChart, ticks }) => {
    return (
      <G key={'grid'}>
        {dataChart.map((_, index) => {
          return (
            <Line
              key={`${index}`}
              strokeDasharray="5, 5"
              y1={y(dataChart[index])}
              y2={y(0)}
              x1={x(index)}
              x2={x(index)}
              stroke={index === selected?.index ? Colors.primary2 : Colors.primary5}
              strokeWidth={1}
            />
          );
        })}
      </G>
    );
  };
  const CustomLine = ({ line }) => (
    <Path key={'line'} d={line} stroke={Colors.primary2} strokeWidth={2} fill={'none'} />
  );

  const CustomXAxis = ({ x, y, data: dataChart }) =>
    (dataLabel?.length ? dataLabel : dataChart).map((_, index) => (
      <G
        id={`${index}`}
        key={`${index}`}
        x={x(index) - widthItemChart / 2}
        y={0}
        onPressIn={() => {
          setSelected({
            index,
            value: _,
          });
        }}
      >
        <G>
          <Text
            x={widthItemChart / 2}
            dy={'97%'}
            alignmentBaseline={'middle'}
            textAnchor={'middle'}
            fontWeight={index === selected?.index ? '300' : '100'}
            stroke={index === selected?.index ? Colors.primary2 : Colors.gray5}
            fontSize={14}
          >
            {`${_}`}
          </Text>
        </G>
        <Rect height={'100%'} width={widthItemChart} fillOpacity={0} />
      </G>
    ));

  useEffect(() => {
    setSelected();
  }, [data?.length]);

  return (
    <>
      <View style={{ flexDirection: 'row' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <AreaChart
              style={{ height: 220, width: data?.length * widthItemChart }}
              data={data}
              contentInset={contentInset}
              curve={shape.curveMonotoneX}
              svg={{
                fill: 'url(#gradient)',
              }}
              gridMax={maxValue}
              gridMin={0}
              numberOfTicks={6}
            >
              <Gradient />
              <CustomGrid />
              <CustomLine />
              {selected ? <Tooltip /> : null}
              <CustomXAxis />
            </AreaChart>
          </View>
        </ScrollView>
        <YAxis
          data={data}
          numberOfTicks={6}
          contentInset={contentInset}
          svg={{
            fill: Colors.gray5,
            fontSize: 12,
          }}
          formatLabel={(value) => (Number.isInteger(value) ? `${value}` : '')}
        />
      </View>
    </>
  );
};

export default CustomLineChart;

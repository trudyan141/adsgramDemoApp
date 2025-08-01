import cssClass from './line-chart.module.scss';
import { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import { Select } from 'antd';
import { useTranslations } from 'next-intl';
import { Empty } from 'antd';

const LineChartComponent = ({ title, typeData, data } : any) => { // typeData : impressions, clicks, ctr, points, conversions

  const t = useTranslations();
  /***
   * STATES
   */
 
  const [timeRange, setTimeRange  ] = useState<any>(
    [
      {
        label: t('DASHBOARD_PAGE_CHART_LAST_7_DAYS'),
        value: '7'
      },
      {
        label: t('DASHBOARD_PAGE_CHART_LAST_30_DAYS'),
        value: '30'
      },
    ]
  );
  const [timeRangeValue, setTimeRangeValue  ] = useState<any>('7');
  /**
   * HOOKS
   */
  /**
   * FUNCTIONS
   */

  const handleChangeTimeRange = (value : any) => {
    setTimeRangeValue(value);
  }
 


  /**
   * RENDERS
   */
  const LineChart = ({ data } : any) => {

  const config = {
    data : data,
    height: 320,
    xField: 'date',
    yField: 'value',
    axis: {
      y: {
        labelFormatter: (v : any) => {
          if(typeData === 'ctr'){
            return `${v?.toLocaleString('en-US')}%`;
          }
          return v.toLocaleString('en-US');
        },
      },
    },
    colorField: 'type',
    tooltip: {
      title: 'date',
      items: [{ channel: 'y', valueFormatter: (v : any) => {
        if(typeData === 'ctr'){
          return `${v?.toLocaleString('en-US')}%`;
        }
        return v.toLocaleString('en-US');
      } }],

    },
    
    point: {
      sizeField: 4,
      shapeField: 'circle',
    },
    legend: {
      color: {
        position: 'right',
        rowPadding: 5,
      },
    },
   
   
  };

  return <Line {...config} />;
};
  return (
    <div className={`${cssClass.LineChartComponent}`}>
      <div className="line-chart-container"> 
        <div className="chart-header"> 
          <div className="chart-title">{title}</div>
          {/* <div className="chart-filter"> 
           <Select
            defaultValue={timeRangeValue}
            style={{ width: 120 }}
            onChange={handleChangeTimeRange}
            options={timeRange}
          />
          </div> */}
        </div>
        <div className="chart-body"> 
          {data?.length > 0 ? (
            <LineChart data={data} />
          ) : (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No data available"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LineChartComponent;

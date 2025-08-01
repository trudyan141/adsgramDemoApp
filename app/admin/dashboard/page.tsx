"use client";
import { Switch, DatePicker, Select } from "antd";
import cssClass from "./page.module.scss";
import { useEffect, useState } from "react";
import StatisticCardComponent from "@/components/dashboard/statisticCard/statistic-card.component";
import LineChartComponent from "@/components/dashboard/lineChart/line-chart.component";
import { useTranslations } from "next-intl";
import { useLocale } from 'next-intl';
import backendService from "@/services/backend/backend.service";
import { BackendTokenContext } from "@/hooks/backendTokenContext";
import useUserProfile  from "@/hooks/useUserProfile";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from 'dayjs';
import { DASHBOARD_DATE_RANGE, DASHBOARD_DATE_RANGE_OPTIONS } from "@/constants/common";
import { formatChartDate } from "@/utils/common";
export default function DashboardPage() {
  
    /**
     * STATES
     * */
  const [statistics, setStatistics] = useState<any>({});
  const [cardList, setCardList] = useState<any>([]);
  const [chartsData, setChartsData] = useState<any>({});
  const [cumulativeMode, setCumulativeMode] = useState<any>(false);
  const [maxRangeDays, setMaxRangeDays] = useState<number>(DASHBOARD_DATE_RANGE);
  const defaultDateRange: [Dayjs, Dayjs] = [
    dayjs().subtract(30, 'day').startOf('day'),
    dayjs().endOf('day')
  ];
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>(defaultDateRange);
  const [allTimeUsers, setAllTimeUsers] = useState<number>(0);
    /**
     * HOOKS
     */
    const router = useRouter();
    const t = useTranslations();
    const locale = useLocale();
    const { token, setToken } = useContext(BackendTokenContext);
    const {
    refetch, // call API again
    data: userProfileData,
    error: userProfileError,
    isLoading: isUserProfileLoading,
    } = useUserProfile(token);
    /**
     * FUNCTIONS
     */
    const mapStatistics = async (list  : any) => {
      try {
        let data ={
            impressions: 0,
            clicks:0,
            ctr: 0,
            points: 0,
            conversions: 0,
            telegram_users: 0,
        }
        list.forEach((item : any) => {
          data.impressions += item.impressions || 0;
          data.clicks += item.clicks || 0;
          //data.ctr += item.ctr || 0;
          data.points += item.points || 0;
          data.conversions += item.conversions || 0;
          data.telegram_users += item.users || 0;
        });
        data.ctr = data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0;
        setStatistics(data);
      } catch (error) {
        console.log(error, 'error=>getStatistics');
      }
    }
    const getType = (type : any) => {
      switch (type) {
        case "impressions":
          return t('DASHBOARD_PAGE_LABEL_IMPRESSIONS');
        case "clicks":
          return t('DASHBOARD_PAGE_LABEL_CLICKS');
        case "ctr":
          return t('DASHBOARD_PAGE_LABEL_CTR');
        case "points":
          return t('ADS_PAGE_TABLE_LABEL_POINTS');
        case "conversions":
          return t('DASHBOARD_PAGE_LABEL_CONVERSATIONS');
        case "users":
          return t('DASHBOARD_PAGE_LABEL_TELEGRAM_USERS');
        default:
          return 'Total'
      }
    }
    const transformData = (list : any) => {
      const types = ["impressions", "clicks", "ctr", "points", "conversions",'users'];
      const result : any = {};
    
      // Initialize result object for each type
      types.forEach(type => {
        result[type] = [];
      });
      // Combine dates from both charts
      const allDates = new Set([
        ...list.map((item: any) => item.date),
      ]);
      // Process each date
      allDates.forEach((date: any) => {
        types.forEach((type: any) => {
          const item = list.find((item: any) => item.date === date) || { [type]: 0 };
          if (item[type] && item[type] !== 0) {
            result[type].push(
              {
                date: formatChartDate(date),
                value: item[type],
                type: getType(type)
              },
            );
        }
        });
      });
    
      return result;
    }
    const mapChart = async (list : any) => {
    
      try {
        const data = transformData(list);
        console.log("🚀 ~ mapChart ~ data:", data)
        setChartsData(data);
  
      } catch (error) {
        console.log(error, 'error=>getStatistics');
        setChartsData({});
      }
    }
    const initData = async () => {
      try {
        const [startDate, endDate] = dateRange;
        if (!startDate || !endDate) return;
        
        let params = {
          from_date: startDate?.format('YYYY-MM-DD'),
          to_date: endDate?.format('YYYY-MM-DD')
        }
        console.log("🚀 ~ initData ~ params:", params)
        const rs = await backendService.getAdminDashboard(params);
        console.log("🚀 ~ initData ~ rs:", rs)
        mapStatistics(rs);
        mapChart(rs);
      } catch (error) {
        console.log(error, 'error=>initData');
      }
    }

    const initCardList = () => {
      let data = [
        { title: `${t('DASHBOARD_PAGE_LABEL_IMPRESSIONS')}`, value: Number(statistics?.impressions) || 0, type: "impressions" },
        { title: `${t('DASHBOARD_PAGE_LABEL_CLICKS')}`, value: Number(statistics?.clicks) || 0, type: "clicks" },
        { title: `${t('DASHBOARD_PAGE_LABEL_CTR')}`, value: Number(statistics?.ctr) || 0, type: "ctr" },
        { title: `${t('DASHBOARD_PAGE_LABEL_TELEGRAM_USERS')}`, value: Number(statistics?.telegram_users) || 0, type: "telegram_users" },
      ]
      setCardList(data);
    }
    const checkAdminRole = async () => {
      if(userProfileData?.roles.includes('admin') === false) {
        router.push('/');
      }
    }
    function recalculateCumulativeValues(data : any) {
      if (data.length === 0) return [];
      
      const result = [...data]; // Create a copy to avoid mutating the original data
  
      let cumulativeSum = 0;
  
      for (let i = 0; i < result.length; i++) {
          cumulativeSum += result[i].value; // Add the current value to the cumulative sum
          result[i].value = cumulativeSum; // Update the current value with the cumulative sum
      }
  
      return result;
  }
    const reCalcChartData = (cumulativeMode : any) => {
      console.log("🚀 ~ reCalcChartData ~ chartsData: cumulativeMode", chartsData, cumulativeMode)
      if(cumulativeMode === false) {
        initData();
        return;
      }
      const impressions = recalculateCumulativeValues(chartsData.impressions);
      const clicks = recalculateCumulativeValues(chartsData.clicks);
      const ctr = recalculateCumulativeValues(chartsData.ctr);
      const points = recalculateCumulativeValues(chartsData.points);
      const conversions = recalculateCumulativeValues(chartsData.conversions);
      const users = recalculateCumulativeValues(chartsData.users);
      setChartsData({
        impressions,
        clicks,
        ctr,
        points,
        conversions,
        users
      });
    }
    const onChangeCumulativeMode = (value : any) => {
      setCumulativeMode(value);
      reCalcChartData(value);
    }
    const disabledRangeDate = (current: Dayjs, info: { type: any; from?: Dayjs }) => {
      if (!current) return false;

      // Don't allow future dates
      if (current.isAfter(dayjs())) {
        return true;
      }

      if (info.from) {
        const minDate = info.from.subtract(maxRangeDays - 1, 'days');
        const maxDate = info.from.add(maxRangeDays - 1, 'days');
        
        // Disable dates that are more than maxRangeDays away from the selected date
        return current.isBefore(minDate) || current.isAfter(maxDate);
      }

      return false;
    };

    const handleDateRangeChange = (
      dates: any,
      dateStrings: [string, string]
    ) => {
      setDateRange(dates ? [dates[0], dates[1]] : [null, null]);
    };

    const handleMaxRangeDaysChange = (value: number) => {
      setMaxRangeDays(value);
      // Update date range when maxRangeDays changes
      const newDateRange: [Dayjs, Dayjs] = [
        dayjs().subtract(value, 'day').startOf('day'),
        dayjs().endOf('day')
      ];
      setDateRange(newDateRange);
    };
  const getAllTimeUsersByAdmin = async () => {
    try {
      let result = await backendService.getAllTimeUsersByAdmin();
      setAllTimeUsers(result?.users || 0);
    } catch (error) {
      console.log("🚀 ~ getAllTimeUsersByAdmin ~ error", error)
    }
  }
    /**
     * USE EFFECTS
     */
    useEffect(() => {
      if (dateRange[0] && dateRange[1]) {
        initData();
      }
    }, [locale, dateRange])
    useEffect(() => {
      initCardList();
    },[statistics, locale])

    useEffect(() => {
      if(token && userProfileData?.id){
        checkAdminRole();
        getAllTimeUsersByAdmin();
      }
    },[userProfileData])
    /**
     * RENDERS
     */
    return (
      <div className={`flex min-h-screen flex-col items-center ${cssClass.dashboardPage}`}>
        <h1 className="text-2xl font-bold pt-4">{t('DASHBOARD_PAGE_TITLE')}</h1>
         <div className="all-time-statistic mt-8 w-full"> 
            <StatisticCardComponent 
                className="w-full"
                title={t(`DASHBOARD_PAGE_LABEL_TELEGRAM_UNIQUE_USERS`)}
                value={allTimeUsers}
                isFormatValue={false}
                type='telegram_unique_users'
              />
          </div>
        <div className="mt-8 flex items-center w-full p-4 bg-white">
         
          <label className="block text-gray-700 text-sm font-bold mr-2">
            {t('DASHBOARD_PAGE_LABEL_DATE_RANGE')}: 
          </label>
          <DatePicker.RangePicker
            onChange={handleDateRangeChange}
            value={dateRange}
            className="w-full md:w-auto mr-4"
            allowClear={false}
            defaultValue={defaultDateRange}
            disabledDate={disabledRangeDate}
          />
          {/* <Select
            value={maxRangeDays}
            onChange={handleMaxRangeDaysChange}
            className="!ml-2 w-32"
            options={DASHBOARD_DATE_RANGE_OPTIONS}
          /> */}
        </div>
        <div className="main-page-container mt-1 mb-4">
          <div className="statistics-container"> 
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cardList.length > 0 && cardList.map((item : any, index : any) => (
                  <div key={index} className="statistics-item">
                    <StatisticCardComponent 
                      title={item.title}
                      value={item.value}
                      type={item.type}
                    />
                  </div>
              ))}
            </div>
          </div>
          <div className="charts-container mt-16"> 
            <div className="chart-mode flex items-center justify-end mb-4 w-full"> 
            {t('ADMIN_DASHBOARD_PAGE_CUMULATIVE_MODE')} <Switch className="green !ml-2" value={cumulativeMode} onChange={(value : any) => onChangeCumulativeMode(value)} />
            </div>
            <div className="chart-content mb-8">
              <LineChartComponent
                title={`${t('DASHBOARD_PAGE_LABEL_IMPRESSIONS_TREND')}`}
                typeData='impressions' 
                data={chartsData.impressions}
                />
            </div>
            <div className="chart-content mb-8">
              <LineChartComponent
                title={`${t('DASHBOARD_PAGE_LABEL_CLICKS_TREND')}`}
                typeData='clicks' 
                data={chartsData.clicks}
                />
            </div>
              <div className="chart-content mb-8">
              <LineChartComponent
                title={`${t('DASHBOARD_PAGE_LABEL_TELEGRAM_USERS_TREND')}`}
                typeData='telegram_users' 
                data={chartsData.users}
                />
            </div>
            {/* <div className="chart-content mb-8">
              <LineChartComponent
                title={`${t('DASHBOARD_PAGE_LABEL_CTR_TREND')}`}
                typeData='ctr' 
                data={chartsData.ctr}
                />
            </div> */}
            {/* <div className="chart-content mb-8">
              <LineChartComponent
                title={`${t('DASHBOARD_PAGE_LABEL_POINTS_TREND')}`}
                typeData='points' 
                data={chartsData.points}
                />
            </div> */}
            {/* <div className="chart-content mb-8">
              <LineChartComponent
                title={`${t('DASHBOARD_PAGE_LABEL_CONVERSATIONS_TREND')}`}
                typeData='conversions' 
                data={chartsData.conversions}
                />
            </div> */}
          </div>
        </div>
      </div>
    );
  
}

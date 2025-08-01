"use client";

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
import { DatePicker, Select } from 'antd';
import { DASHBOARD_DATE_RANGE, DASHBOARD_DATE_RANGE_OPTIONS } from "@/constants/common";
import { formatChartDate } from "@/utils/common";
const MAX_RANGE_DAYS = DASHBOARD_DATE_RANGE; 

export default function DashboardPage() {
  
    /**
     * STATES
     * */
  const [statistics, setStatistics] = useState<any>({});
  const [cardList, setCardList] = useState<any>([]);
  const [chartsData, setChartsData] = useState<any>({});
  const [maxRangeDays, setMaxRangeDays] = useState<number>(MAX_RANGE_DAYS);
  const defaultDateRange: [Dayjs, Dayjs] = [
    dayjs().subtract(30, 'day').startOf('day'),
    dayjs().endOf('day')
  ];
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>(defaultDateRange);

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
    const getAdStats = async () => {
      try {
        const [startDate, endDate] = dateRange;
        let params = {
          from_date: startDate?.format('YYYY-MM-DD'),
          to_date: endDate?.format('YYYY-MM-DD')
        }
        const rs = await backendService.getAdStats(params);
        return rs;
      } catch (error) {
        console.log("🚀 ~ getAdStats ~ error:", error)
        throw error
      }
    }
    const getPublisherStats = async () => {
      try {
        const [startDate, endDate] = dateRange;
        let params = {
          from_date: startDate?.format('YYYY-MM-DD'),
          to_date: endDate?.format('YYYY-MM-DD')
        }
        const rs = await backendService.getPublisherStats(params);
        return rs;
      } catch (error) {
        console.log("🚀 ~ getPublisherStats ~ error:", error)
        throw error
      }
    }
    const getAdChart = async () => {
      try {
        const [startDate, endDate] = dateRange;
        let params = {
          from_date: startDate?.format('YYYY-MM-DD'),
          to_date: endDate?.format('YYYY-MM-DD')
        }
        const rs = await backendService.getAdChart(params);
        return rs;
      } catch (error) {
        console.log("🚀 ~ getAdChart ~ error:", error)
        throw error
      }
    }
    const getPublisherChart = async () => {
      try {
        const [startDate, endDate] = dateRange;
        let params = {
          from_date: startDate?.format('YYYY-MM-DD'),
          to_date: endDate?.format('YYYY-MM-DD')
        }
        const rs = await backendService.getPublisherChart(params);
        return rs;
      } catch (error) {
        console.log("🚀 ~ getPublisherChart ~ error:", error) 
        throw error
      }
    }
    const mapStatistics = async ({adStats, publisherStats} : any) => {
      try {
        let data ={
          advertiser: {
            impressions: adStats.impressions || 0,
            clicks: adStats.clicks || 0,
            ctr: adStats.ctr * 100 || 0,
            points: adStats.points || 0,
            conversions: adStats.conversions || 0,
            telegramUsers: adStats.users || 0
          },
          publisher: {
            impressions: publisherStats.impressions || 0,
            clicks: publisherStats.clicks || 0,
            ctr: publisherStats.ctr * 100 || 0,
            points: publisherStats.points || 0,
            conversions: publisherStats.conversions || 0,
            telegramUsers: publisherStats.users || 0
          }
        }
        setStatistics(data);
      } catch (error) {
        console.log(error, 'error=>getStatistics');
      }
    }
    const transformData = ({adChart, publisherChart} : any) => {
      const types = ["impressions", "clicks", "ctr", "points", "conversions",'users'];
      const result : any = {};
    
      // Initialize result object for each type
      types.forEach(type => {
        result[type] = [];
      });
    
      // Combine dates from both charts
      const allDates = new Set([
        ...adChart.map((item: any) => item.date),
        ...publisherChart.map((item: any) => item.date)
      ]);
       // Remove duplicate dates and sort them in ascending order
      const uniqueDates = Array.from(new Set(allDates));
      const sortedDates = uniqueDates.sort((a, b) => a.localeCompare(b));
  
      sortedDates.forEach((date: any) => {
        types.forEach((type: any) => {
          const adItem = adChart.find((item: any) => item.date === date) || { [type]: 0 };
          const pubItem = publisherChart.find((item: any) => item.date === date) || { [type]: 0 };
          if (adItem[type] !== 0 || pubItem[type] !== 0) {
            result[type].push(
              {
                date: formatChartDate(date),
                value: type === "ctr" ? adItem[type] * 100 : adItem[type],
                type: t('DASHBOARD_PAGE_LABEL_ADVERTISERS')
              },
              {
                date: formatChartDate(date),
                value: type === "ctr" ? pubItem[type] * 100 : pubItem[type],
                type: t('DASHBOARD_PAGE_LABEL_PUBLISHER')
              }
            );
          }
        });
      });
    
      return result;
    }
    const mapChart = async ({adChart, publisherChart} : any) => {
      console.log("🚀 ~ mapChart ~ publisherChart:", publisherChart)
      console.log("🚀 ~ mapChart ~ adChart:", adChart)
      setChartsData({});
      try {
        const data = transformData({adChart, publisherChart});
        console.log("🚀 ~ mapChart ~ data:", data)
        setChartsData(data);
  
      } catch (error) {
        console.log(error, 'error=>getStatistics');
        setChartsData({});
      }
    }
    const initData = async () => {
      try {
        let adStats = {};
        let publisherStats = {};
        let adChart = {};
        let publisherChart = {};
        const calls =[getAdStats(), getPublisherStats(), getAdChart(), getPublisherChart()];
        const [adStatsPromise, publisherStatsPromise , adChartPromise, publisherChartPromise] = await Promise.allSettled(calls);
        
        // mapStatistics
        if (adStatsPromise.status === 'fulfilled') {
          adStats = adStatsPromise.value;
        
        }
        if (publisherStatsPromise.status === 'fulfilled') {
          publisherStats = publisherStatsPromise.value;
        }
        mapStatistics({adStats, publisherStats});

        // mapChart
        if (adChartPromise.status === 'fulfilled') {
          adChart = adChartPromise.value;
        }
        if (publisherChartPromise.status === 'fulfilled') {
          publisherChart = publisherChartPromise.value;
        }
        mapChart({adChart, publisherChart});
      } catch (error) {
        console.log(error, 'error=>initData');
      }
    }

    const initCardList = () => {
      let data = [
        { title: `${t('DASHBOARD_PAGE_LABEL_IMPRESSIONS')} (${t('DASHBOARD_PAGE_LABEL_ADVERTISERS')})`, value: Number(statistics?.advertiser?.impressions) || 0, type: "impressions" },
        { title: `${t('DASHBOARD_PAGE_LABEL_CLICKS')} (${t('DASHBOARD_PAGE_LABEL_ADVERTISERS')})`, value: Number(statistics?.advertiser?.clicks) || 0, type: "clicks" },
        { title: `${t('DASHBOARD_PAGE_LABEL_CTR')} (${t('DASHBOARD_PAGE_LABEL_ADVERTISERS')})`, value: Number(statistics?.advertiser?.ctr) || 0, type: "ctr" },
        { title: `${t('DASHBOARD_PAGE_LABEL_TELEGRAM_USERS')} (${t('DASHBOARD_PAGE_LABEL_ADVERTISERS')})`, value: Number(statistics?.advertiser?.telegramUsers) || 0, type: "telegram_users" },
        //{ title: `${t('DASHBOARD_PAGE_LABEL_POINTS')} (${t('DASHBOARD_PAGE_LABEL_ADVERTISERS')})`, value: Number(statistics?.advertiser?.points) || 0, type: "points" },
        //{ title: `${t('DASHBOARD_PAGE_LABEL_CONVERSATIONS')} (${t('DASHBOARD_PAGE_LABEL_ADVERTISERS')})`, value: Number(statistics?.advertiser?.conversions) || 0, type: "conversions" },
        { title: `${t('DASHBOARD_PAGE_LABEL_IMPRESSIONS')} (${t('DASHBOARD_PAGE_LABEL_PUBLISHER')})`, value: Number(statistics?.publisher?.impressions) || 0, type: "impressions" },
        { title: `${t('DASHBOARD_PAGE_LABEL_CLICKS')} (${t('DASHBOARD_PAGE_LABEL_PUBLISHER')})`, value: Number(statistics?.publisher?.clicks) || 0, type: "clicks" },
        { title: `${t('DASHBOARD_PAGE_LABEL_CTR')} (${t('DASHBOARD_PAGE_LABEL_PUBLISHER')})`, value: Number(statistics?.publisher?.ctr) || 0, type: "ctr" },
        { title: `${t('DASHBOARD_PAGE_LABEL_TELEGRAM_USERS')} (${t('DASHBOARD_PAGE_LABEL_PUBLISHER')})`, value: Number(statistics?.publisher?.telegramUsers) || 0, type: "telegram_users" },
        //{ title: `${t('DASHBOARD_PAGE_LABEL_POINTS')} (${t('DASHBOARD_PAGE_LABEL_PUBLISHER')})`, value: Number(statistics?.publisher?.points) || 0, type: "points" },
        //{ title: `${t('DASHBOARD_PAGE_LABEL_CONVERSATIONS')} (${t('DASHBOARD_PAGE_LABEL_PUBLISHER')})`, value: Number(statistics?.publisher?.conversions) || 0, type: "conversions" },
      ]
      setCardList(data);
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
      setDateRange([
        dayjs().subtract(value, 'day').startOf('day'),
        dayjs().endOf('day')
      ]);
    };

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

    /**
     * RENDERS
     */
    return (
      <div className={`flex min-h-screen flex-col items-center xl:p-24 xs:p-4 ${cssClass.dashboardPage}`}>
        <h1 className="text-2xl font-bold pt-4">{t('DASHBOARD_PAGE_TITLE')}</h1>
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
        <div className="main-page-container mt-4 mb-4">
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
            <div className="chart-content mb-8">
              <LineChartComponent
                title={`${t('DASHBOARD_PAGE_LABEL_IMPRESSIONS_TREND')} (${t('DASHBOARD_PAGE_LABEL_ADVERTISERS')} vs ${t('DASHBOARD_PAGE_LABEL_PUBLISHER')})`}
                typeData='impressions' 
                data={chartsData.impressions}
                />
            </div>
            <div className="chart-content mb-8">
              <LineChartComponent
                title={`${t('DASHBOARD_PAGE_LABEL_CLICKS_TREND')} (${t('DASHBOARD_PAGE_LABEL_ADVERTISERS')} vs ${t('DASHBOARD_PAGE_LABEL_PUBLISHER')})`}
                typeData='clicks' 
                data={chartsData.clicks}
                />
            </div>
            <div className="chart-content mb-8">
              <LineChartComponent
                title={`${t('DASHBOARD_PAGE_LABEL_CTR_TREND')} (${t('DASHBOARD_PAGE_LABEL_ADVERTISERS')} vs ${t('DASHBOARD_PAGE_LABEL_PUBLISHER')})`}
                typeData='ctr' 
                data={chartsData.ctr}
                />
            </div>
            <div className="chart-content mb-8">
              <LineChartComponent
                title={`${t('DASHBOARD_PAGE_LABEL_TELEGRAM_USERS_TREND')} (${t('DASHBOARD_PAGE_LABEL_ADVERTISERS')} vs ${t('DASHBOARD_PAGE_LABEL_PUBLISHER')})`}
                typeData='telegram_users' 
                data={chartsData.users}
                />
            </div>
            {/* <div className="chart-content mb-8">
              <LineChartComponent
                title={`${t('DASHBOARD_PAGE_LABEL_POINTS_TREND')} (${t('DASHBOARD_PAGE_LABEL_ADVERTISERS')} vs ${t('DASHBOARD_PAGE_LABEL_PUBLISHER')})`}
                typeData='points' 
                data={chartsData.points}
                />
            </div> */}
            {/* <div className="chart-content mb-8">
              <LineChartComponent
                title={`${t('DASHBOARD_PAGE_LABEL_CONVERSATIONS_TREND')} (${t('DASHBOARD_PAGE_LABEL_ADVERTISERS')} vs ${t('DASHBOARD_PAGE_LABEL_PUBLISHER')})`}
                typeData='conversions' 
                data={chartsData.conversions}
                />
            </div> */}
          </div>
        </div>
      </div>
    );
  
}

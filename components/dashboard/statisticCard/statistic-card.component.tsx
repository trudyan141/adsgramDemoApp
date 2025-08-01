import cssClass from './statistic-card.module.scss';
import AnimatedNumber from 'animated-number-react';
import { HeartOutlined, SendOutlined, PercentageOutlined, GiftOutlined, CrownOutlined, UserOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

const StatisticCardComponent = ({ title, value, type, className, isFormatValue = true } : any) => {


  const getIcon = () => {
    switch(type) {
      case 'impressions':
        return <HeartOutlined />;
      case 'clicks':
        return <SendOutlined />;
      case 'ctr':
        return <PercentageOutlined />;
      case 'points':
        return <GiftOutlined />;
      case 'conversions':
        return <CrownOutlined />;
      case 'telegram_users':
        return <UserOutlined />;
      case 'telegram_unique_users':
        return <UserOutlined />;
      default:
        return <HeartOutlined />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'impressions':
        return '#F87171';
      case 'clicks':
        return '#60A5FA';
      case 'ctr':
        return '#34D399';
      case 'points':
        return '#FBBF24';
      case 'conversions':
        return '#A78BFA';
      case 'telegram_users':
        return '#38BDF8';
      case 'telegram_unique_users':
        return '#3B82F6';
      default:
        return '#D1D5DB';
    }
  };

  const formatValue = (n: number) => {
    if (title?.toLowerCase()?.includes('ctr')) {
      if (!n) return '0%';
      const formatted = Number(n.toFixed(2));
      return formatted === Math.floor(formatted) ? 
        `${Math.floor(formatted)}%` : 
        `${formatted}%`;
    }
    if (!isFormatValue) { 
      return new Intl.NumberFormat('en-US').format(Math.floor(n || 0));
    }
    n = Math.floor(n || 0);
    if (n >= 1000000000) {
      return `${(n / 1000000000).toFixed(1).replace(/\.0$/, '')}B`;
    }
    if (n >= 1000000) {
      return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (n >= 1000) {
      return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    }
    return n.toString();
  };

  const getFullValue = (n: number) => {
    if (title?.toLowerCase()?.includes('ctr')) {
      if (n === 0) return '0%';
      return `${n.toFixed(2)}%`;
    }
    return new Intl.NumberFormat('en-US').format(Math.floor(n || 0));
  };
 
  return (
    <div className={`${cssClass.StatisticCardComponent} ${className}`}>
      <div className={`relative bg-white p-4 rounded-lg shadow-md border ${cssClass.cardBorder} min-h-[90px] card-container`}
           style={{ borderLeft: `4px solid ${getColor()}` }}>
        <div className="flex flex-col h-full">
          <div className="text-gray-500 text-sm mb-3 font-semibold break-words min-h-[40px] flex">{title}</div>
          <div className="text-4xl font-semibold flex items-center justify-between">
            <Tooltip title={getFullValue(Number(value))} placement="top">
              <div className="flex items-center">
                <AnimatedNumber
                  initialValue={0}
                  value={Number(value)}
                  formatValue={formatValue}
                  duration={1500}
                  delay={1000}
                />
              </div>
            </Tooltip>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-opacity-10 text-lg`}
                style={{ backgroundColor: getColor(), color: '#ffffff' }}>
              {getIcon()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatisticCardComponent;

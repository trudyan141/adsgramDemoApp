
import { GlobalOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown } from 'antd';
import cssClass from "./lang-dropdown.module.scss";
import { useLocale } from 'next-intl';
import {setUserLocale} from '@/services/locale';
export default function LangDropdown() {

  /**
   * HOOKS
   */
  const locale = useLocale();
  /**
   * FUNCTIONS
   */
  const handleMenuClick = (key: any) => {
    setUserLocale(key);
  };
  /**
   * RENDERS
   */
  const items: MenuProps['items'] = [
  {
    key: 'en',
    label: (
      <div onClick={() => handleMenuClick('en')} className={`flex items-center ${locale === 'en' ? 'active' : ''}`}>
        <img width={16} src="/images/country/us.svg" alt="en" className='mr-2' /> English
      </div>
    ),
  },
  {
    key: 'ja',
    label: (
      <div onClick={() => handleMenuClick('ja')} className= {`flex items-center ${locale === 'ja' ? 'active' : ''}`}>
        <img width={16} src="/images/country/jp.svg" alt="ja" className='mr-2' /> 日本
      </div>
    ),
  },
];

  return (
     <div className={`${cssClass.langDropdown}`}> 
      <div className={`lang-dropdown`}>
        <Dropdown menu={{ items }} trigger={['click']}>
          <Avatar
          style={{ cursor: 'pointer' }}
          size="large"
          icon={<GlobalOutlined />}
        />
      </Dropdown>
      </div>
    </div>
  );
}

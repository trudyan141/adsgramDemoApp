import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown } from 'antd';
import { useRouter } from 'next/navigation';
import cssClass from "./profile.module.scss";
import { useTranslations } from 'next-intl';


export default function Profile({ userProfile }: any) {

  /**
   * HOOKS
   */
  const router = useRouter();
  const t = useTranslations();

  /**
   * FUNCTIONS
   */
  const handleMenuClick = (key: string) => {
    if (key === 'profile') {
      router.push('/my-profile')
    } else if (key === 'admin') {
      router.push('/admin/dashboard')
    }
  };

  /**
   * RENDERS
   */
  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <div onClick={() => handleMenuClick('profile')}>
          {t('MY_PROFILE_NAV_LABEL_MY_PROFILE')}
        </div>
      ),
    },
    ...(userProfile?.roles?.includes('admin') ? [{
      key: 'admin',
      label: (
        <div onClick={() => handleMenuClick('admin')}>
          {t('ADMIN_HEADER_NAV_TITLE_ADMIN_PANEL')}
        </div>
      ),
    }] : []),
  ];

  return (
    <div className={`${cssClass.myProfileComponent}`}> 
      <div className={`my-profile`}>
        <Dropdown menu={{ items }} trigger={['click']}>
          <Avatar
            style={{ cursor: 'pointer' }}
            size="large"
            icon={<UserOutlined />}
          />
        </Dropdown>
      </div>
    </div>
  );
}

"use client";
import { Layout, Menu, Button } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { BackendTokenContext } from "@/hooks/backendTokenContext";
import backendService from "@/services/backend/backend.service";
import { 
  PictureOutlined, 
  RightOutlined,
  LeftOutlined,
  DashboardOutlined,
  UserOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useState, useEffect, useContext, use } from 'react';
import useUserProfile from "@/hooks/useUserProfile";
import { useTranslations } from 'next-intl';
const { Content, Sider } = Layout;



export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [showSider, setShowSider] = useState(true);
  const router = useRouter();
  const { token, setToken } = useContext(BackendTokenContext);
  const {
  refetch, // call API again
  data: userProfileData,
  error: userProfileError,
  isLoading: isUserProfileLoading,
  } = useUserProfile(token);
  const t = useTranslations();

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/admin/dashboard">{t('MAIN_HEADER_NAV_LABEL_DASHBOARD')}</Link>
    },
    {
      key: 'task',
      icon: <PictureOutlined />,
      label: t('ADMIN_PAGE_SIDEBAR_TITLE_NAV_MANAGE_ADS'),
      children: [
        {
          key: '/admin/manage-tasks',
          label: <Link href="/admin/manage-tasks">{t('ADMIN_PAGE_SIDEBAR_TITLE_NAV_ADS_LIST')}</Link>
        },
      ]
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: t('ADMIN_PAGE_SIDEBAR_TITLE_NAV_MANAGE_USERS'),
      children: [
        {
          key: '/admin/manage-users',
          label: <Link href="/admin/manage-users">{t('ADMIN_PAGE_SIDEBAR_TITLE_NAV_USERS_LIST')}</Link>
        },
      ]
    },
  ];

  const checkRoles = async () => {
    if (userProfileData) {
      if (!userProfileData?.roles?.includes('admin')) {
        router.push('/')
      }
    }
  }
  const calcLayoutMarginLeft = () => {
    if (isMobile) {
      return 0;
    }
    return showSider ? 0 : -250;
  };
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowSider(!mobile); // Hide on mobile by default, show on desktop
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  useEffect(() => {
    checkRoles();
  }, [userProfileData]);
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }} className='admin-main-layout flex'>
      <Sider 
        width={250} 
        style={{
          position: isMobile ? 'fixed' : 'relative',
          height: '100%',
          zIndex: 1000,
          left: showSider ? 0 : -250,
          transition: 'all 0.2s',
          top: isMobile ? 0 : '0px',
          background: '#fff',
        }}
      >
        <div style={{ 
          height: 32, 
          margin: 16, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          color:'rgb(134 146 158)',
          paddingTop: isMobile ? '64px' : '16px',
        }}>
         <span>{t('ADMIN_HEADER_NAV_TITLE_ADMIN_PANEL')}</span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          defaultOpenKeys={['tasks']}
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems}
        />
         <Button
          type="text"
          icon={showSider 
            ? <div className="flex items-center gap-1 text-blue-500"> <LeftOutlined /> </div> 
            : <div className="flex items-center gap-1 text-blue-500"> <RightOutlined /></div>}
          onClick={() => setShowSider(!showSider)}
          style={{
            position: 'absolute',
            top: isMobile ? '64px' : '24px',
            right: showSider ? '-16px' : '-32px',
            width: '32px',
            height: '32px',
            padding: 0,
            borderRadius: '8px',
            background: '#fff',
            zIndex: 10,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            border: "1px solid rgb(239, 242, 247)"
          }}
        />
      </Sider>
     
      <Layout style={{ 
        marginLeft: calcLayoutMarginLeft(),
        transition: 'all 0.2s',
        minHeight: '100vh'
      }}>
        <Content style={{ 
          padding: '24px',
          margin: '24px',
          background: '#fff',
          minHeight: 'calc(100vh - 48px)'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

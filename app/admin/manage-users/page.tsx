"use client";
import { BackendTokenContext } from "@/hooks/backendTokenContext";
import { Table, Pagination, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState, useCallback } from "react";
import { useTranslations } from 'next-intl';
import cssClass from "./page.module.scss";
import backendService from "@/services/backend/backend.service";
import UserFilterForm from '@/components/admin/manageUsers/UserFilterForm';

export default function ManageUsersPage() {
  /**
   * STATES
   */
  const [list, setList] = useState<any>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    userId: '',
    username: '',
    projectName: '',
    roles: []
  });

  /**
   * HOOKS
   */
  const router = useRouter();
  const { token } = useContext(BackendTokenContext);
  const t = useTranslations();

  const columns = [
    {
      title: t('ADS_PAGE_TABLE_LABEL_ORDER'),
      key: 'index',
      width: 70,
      render: (_: any, __: any, index: number) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: t('ADMIN_PAGE_USER_TABLE_LABEL_EMAIL'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('ADMIN_PAGE_USER_TABLE_LABEL_PROJECTS'),
      dataIndex: 'all_projects',
      key: 'all_projects',
      render: (projects: string[]) => projects?.join(', ') || '-'
    },
    {
      title: t('ADMIN_PAGE_USER_TABLE_LABEL_ROLE'),
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => { return <div className="capitalize">{roles?.join(', ') || '-' }</div> }
    },
    {
      title: t('ADMIN_PAGE_USER_TABLE_LABEL_EXTRA_ROLES'),
      dataIndex: 'extra_roles',
      key: 'extra_roles',
      render: (extra_roles: string[]) => extra_roles?.join(' & ') || '-'
    }
  ];

  const handleFilterSubmit = (values: any) => {
    console.log("🚀 ~ handleFilterSubmit ~ values:", values)
    setFilters(values);
    setPagination({ ...pagination, current: 1 }); // Reset to first page
  };

  const handlePageChange = (page:number, pageSize: number) => {
    
    setPagination({
      ...pagination,
      current: page,
      pageSize
    });
   };

  const initData = useCallback(async () => {
    try {
    
      console.log("🚀 ~ initData ~ token:", token)
      console.log("🚀 ~ initData ~ filters:", filters)
      if (token) {
        setLoading(true);
        let params : any ={
          offset : (pagination.current - 1) * pagination.pageSize,
          limit: pagination.pageSize,
          // userId: filters.userId,
          // username: filters.username,
          project: filters.projectName,
          //roles: filters.roles
        }
        const rs = await backendService.getUsersByAdmin(params);
        const paginatedData = rs?.items?.map((item : any) => { 
          return {
            ...item,
            id: item.id,
            email: item.email,
            all_projects: item.all_projects,
            extra_roles: item.extra_roles
          };
        }) || [];
        if (paginatedData) {
          setList(paginatedData);
          setPagination({
            ...pagination,
            total: rs?.total || 0
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.log("🚀 ~ initData ~ error:", error)
      setLoading(false);
    }
  },[token, pagination.current, filters]);

  useEffect(() => {
    initData();
  }, [initData]);

  return (
    <div className={`${cssClass.manageUsersPage}`} >
      <div className="main-page-container">
        <section className="filters-container mb-8">
          <UserFilterForm onFilterSubmit={handleFilterSubmit} /> 
        </section>
    
        <div className="campaign-list"> 
          <div className="table-responsive">
            <div className="responsive-table">
              <Table
                loading={loading}
                columns={columns}
                dataSource={list}
                pagination={false}
                rowKey="id"  // Assuming targetUrl is unique for each campaign
              />
            </div>
          </div>
          {pagination.total > pagination.pageSize && <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            style={{ display: 'flex', justifyContent: 'center', marginTop: 16, textAlign: 'right' }}
          />}
        </div>
      </div>
    </div>
  );
}

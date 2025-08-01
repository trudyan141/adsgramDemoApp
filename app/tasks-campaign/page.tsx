"use client";
import { MAX_ADVERTISER_ITEMS, TASK_TYPES } from "@/constants/common";

import { BackendTokenContext } from "@/hooks/backendTokenContext";
import backendService from "@/services/backend/backend.service";
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useTonWallet } from '@tonconnect/ui-react';
import { Button, message, Pagination, Popconfirm, Space, Table } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from "react";
import cssClass from "./page.module.scss";
import { ExclamationCircleOutlined} from '@ant-design/icons';
import { Tooltip, Switch } from 'antd';
import { useTranslations } from 'next-intl';
export default function TasksPage() {
  /**
   * STATES
   * */
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0
  });
  
  /**
   * HOOKS
   */
  const router = useRouter()
  const wallet = useTonWallet();
  const { token } = useContext(BackendTokenContext);
  const t = useTranslations();
  const columns = [
    {
      title: t('ADS_PAGE_TABLE_LABEL_ORDER'),
      key: 'order',
      render: (page : any,payload: any, index: any) => index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    { 
      title: t('ADS_PAGE_TABLE_LABEL_BANNER'), 
      dataIndex: 'image_url', 
      key: 'image_url', 
      width: 120,
      render: (image_url:any)=> <img width={'96px'} className="banner-image" src={image_url} alt="banner" /> 
    },
    { title: t('ADS_PAGE_TABLE_LABEL_TARGET_URL'), dataIndex: 'targetUrl', key: 'targetUrl', render: (url:any)=> <a target="_blank" href={url}>{url} </a> },
    { title: t('ADS_PAGE_TABLE_LABEL_TITLE'), dataIndex: 'altText', key: 'altText' },
    // { title: t('ADS_PAGE_TABLE_LABEL_DESCRIPTION'), dataIndex: 'description', key: 'description' },
    // { title: t('ADS_PAGE_TABLE_LABEL_CONVERSION_POINT'), dataIndex: 'conversionPoint', key: 'conversionPoint' },
    // { title: t('ADS_PAGE_TABLE_LABEL_POINTS'), dataIndex: 'reward_point', key: 'reward_point' },
    // { title: t('ADS_PAGE_TABLE_LABEL_REWARD_CTA'), dataIndex: 'reward_info', key: 'reward_info' },
    { title: t('ADS_PAGE_TABLE_LABEL_DISPLAY'), key: 'display', render: (record : any) => (
      <div className={`display-status`}>
        <Switch className="green" value={record.display} onChange={(value) => onChangeDisplay(value, record)} />
      </div>
      ) },
    {
      title: t('ADS_PAGE_TABLE_LABEL_STATUS'), key: 'status',
      render: (record : any) => (
        <div className={`status ${record?.status?.toLowerCase()}`}> {record?.status}
          {(record?.status.toLowerCase() === 'reject' || record?.status.toLowerCase() === 'rejected') &&  <Tooltip title={record?.review_comment}>
              <ExclamationCircleOutlined className="tooltip-icon" />
          </Tooltip>}
        </div>
      )
    },
    {
      title: t('ADS_CREATE_PAGE_TASK_TYPE_LABEL'),
      key: 'task_type',
      render: (page: any, record: any) => {
        const taskType = TASK_TYPES.find(type => type.value === (record.task_type || 'Repeating'));
        return <div className={`task-type ${record.task_type?.toLowerCase()}`}>{t(taskType?.label || 'TASK_TYPE_REPEATING')}</div>;
      }
    },
    {
      title: t('ADS_PAGE_TABLE_LABEL_ACTION'),
      key: 'action',
      render: (page: any, record: any) => (
        <div className="flex">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => router.push(`/tasks-campaign/${record.id}/edit`)}
            style={{ color: '#f97316' }}
          >
            {t('ADS_PAGE_TABLE_LABEL_EDIT')}
          </Button>
          <Popconfirm
            title={t('ADS_PAGE_LABEL_DELETE_CONFIRM')}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDelete(record.id)}
            okText={t('ADS_PAGE_LABEL_DELETE_BTN_YES')}
            cancelText={t('ADS_PAGE_LABEL_DELETE_BTN_NO')}
          >
            <Button danger type="link" className="text-red-700" icon={<DeleteOutlined />}>
              {t('ADS_PAGE_TABLE_LABEL_DELETE')}
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  /**
   * FUNCTIONS
  */
  const handleEditCampaign = (record :any) => {
    router.push(
      `/tasks-campaign/${record.id}/edit`);
  };
  const createAds = () => {
    // if(pagination.total > MAX_ADVERTISER_ITEMS) {
    //   return;
    // }
    router.push("/tasks-campaign/create")
  }
  const handleDelete = async (id: number) => {

    try {
      await backendService.postDeleteAd(id);
      message.success(t('MESSAGE_AD_DELETE_SUCCESS'));
      initData();
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error)
    }
  }
  const initData = useCallback(async () => {
    try {

      if (token) {
        let params : any ={
          offset : (pagination.current - 1) * pagination.pageSize,
          limit: pagination.pageSize,
        }
        const rs = await backendService.getAds(params);
        const paginatedData = rs?.items?.map((item : any) => { 
          return {
            ...item,
            display: item.display ? item.display : false, 
            targetUrl: item.url,
            altText: item.alt,
            description: item.description,
            conversionPoint: item.conversion_point_type,
            // points: item.points,
            // rewardDesc: item.info
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
    } catch (error) {
      console.log("🚀 ~ initData ~ error:", error)
    }
  },[token, pagination.current]);
   const handlePageChange = (page:number, pageSize: number) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize
    });
   };
  const onChangeDisplay = async (value: boolean, record: any) => {

    try {
      const params = {
        display: value
      }
      const rs = await backendService.updateDisplayStatus(record.id,params);
      message.success(t('MESSAGE_AD_UPDATE_SUCCESS'));
    } catch (error : any) {
      console.log("🚀 ~ onChangeDisplay ~ error:", error)
        message.error(error?.response?.data?.message 
          || error?.data?.message 
          || error?.message);
    }finally{
      initData();
    }
  }
   /**
   * USE EFFECTS
   */
  useEffect(() => {
    initData();
   }, [initData]);

  /**
   * RENDERS
   */
  return (
    <div className={`flex min-h-screen flex-col items-center xl:p-24 xs:p-4 ${cssClass.tasksPage}`} >
      <h1 className="text-2xl font-bold pt-4">{t('ADS_PAGE_TITLE') }</h1>
      <div className="main-page-container mt-4 mb-4"> 
        <div className='header-content flex items-center justify-between'>
          <div className="title font-bold"> {t('ADS_PAGE_CARD_TITLE') } </div>
          <div className="btn-actions">  
            <Button  type="primary" onClick={createAds}>{t('ADS_PAGE_BTN_CREATE') } </Button>
           </div>
        </div>
        <div className="campaign-list mt-8"> 
          <div className="table-responsive">
            <div className="responsive-table">
              <Table
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

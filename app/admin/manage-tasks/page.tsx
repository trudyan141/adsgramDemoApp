"use client";
import { MAX_ADVERTISER_ITEMS } from "@/constants/common";

import { BackendTokenContext } from "@/hooks/backendTokenContext";
import backendService from "@/services/backend/backend.service";
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useTonWallet } from '@tonconnect/ui-react';
import { Button, Pagination, Popconfirm, Table, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from "react";
import cssClass from "./page.module.scss";
import { ExclamationCircleOutlined} from '@ant-design/icons';
import { Tooltip, Switch, Input } from 'antd';
import { useTranslations } from 'next-intl';
import AdsFilterForm from "@/components/admin/manageAds/AdsFilterForm";
import { AD_STATUS } from "@/constants/common";
export default function ManageTasksPage() {
  /**
   * STATES
   * */
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0
  });
  const [filters, setFilters] = useState({
    adId: '',
    userId: '',
    status: '',
    title: '',
  });
  const [comment, setComment] = useState('');
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
    { title: t('ADS_PAGE_TABLE_LABEL_BANNER'), dataIndex: 'image_url', key: 'image_url', render: (image_url:any)=> <img className="banner-image" src={image_url} alt="banner" /> },
    { title: t('ADS_PAGE_TABLE_LABEL_TARGET_URL'), dataIndex: 'targetUrl', key: 'targetUrl', render: (url:any)=> <a target="_blank" href={url}>{url} </a> },
    { title: t('ADS_PAGE_TABLE_LABEL_TITLE'), dataIndex: 'altText', key: 'altText' },
    { title: t('ADS_PAGE_TABLE_LABEL_DESCRIPTION'), dataIndex: 'description', key: 'description' },
    // { title: t('ADS_PAGE_TABLE_LABEL_CONVERSION_POINT'), dataIndex: 'conversionPoint', key: 'conversionPoint' },
    // { title: t('ADS_PAGE_TABLE_LABEL_POINTS'), dataIndex: 'reward_point', key: 'reward_point' },
    // { title: t('ADS_PAGE_TABLE_LABEL_REWARD_CTA'), dataIndex: 'reward_info', key: 'reward_info' },
    { title: t('ADS_PAGE_TABLE_LABEL_DISPLAY'), key: 'display', render: (record : any) => (
      <div className={`display-status`}>
        <Switch disabled={true} className="green" value={record.display} onChange={(value) => onChangeDisplay(value, record)} />
      </div>
      ) },
    {
      title: t('ADS_PAGE_TABLE_LABEL_STATUS'), key: 'status',
      render: (record : any) => (
        <>
        <div className={`status ${record?.status?.toLowerCase()}`}> {record?.status}
          {(record?.status?.toLowerCase() === 'reject' || record?.status?.toLowerCase() === 'rejected') &&  <Tooltip title={record?.review_comment}>
              <ExclamationCircleOutlined className="tooltip-icon" />
          </Tooltip>}
        </div>
        { record?.status === AD_STATUS.inReview && <div className="mt-4 btn-actions">
          <Popconfirm
          title={t('ADMIN_PAGE_ADS_LIST_POPUP_CONFIRM_TITLE_APPROVE')}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => handleApprove(record.id)}
          okText={t('ADS_PAGE_LABEL_DELETE_BTN_YES')}
          cancelText={t('ADS_PAGE_LABEL_DELETE_BTN_NO')}
        >
          <Button  type="primary"  className="mr-2" >
          {t('ADMIN_PAGE_ADS_LIST_BTN_ACTIVE')}
          </Button>
        </Popconfirm>
        <Popconfirm
           title={
            <div>
              <p>{t('ADMIN_PAGE_ADS_LIST_POPUP_CONFIRM_TITLE_REJECT')}</p>
              <Input.TextArea
                rows={4}
                placeholder={t('ADMIN_PAGE_ADS_LIST_POPUP_CONFIRM_REVIEW_COMMENTS')}
                value={comment}
                onChange={handleInputCommentChange}
              />
            </div>
          }
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => handleReject(record.id, comment)}
          okText={t('ADS_PAGE_LABEL_DELETE_BTN_YES')}
          cancelText={t('ADS_PAGE_LABEL_DELETE_BTN_NO')}
        >
        
          <Button danger className="mt-2">
            {t('ADMIN_PAGE_ADS_LIST_BTN_REJECT')}
          </Button>
        </Popconfirm>
        </div>
      }
        </>
      )
    },
    // {
    //   title: t('ADS_PAGE_TABLE_LABEL_ACTION'),
    //   key: 'action',
    //   render: (page : any , record : any) => (
    //     <Popconfirm
    //       title={t('ADS_PAGE_LABEL_DELETE_CONFIRM')}
    //       icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
    //       onConfirm={() => handleDelete(record.id)}
    //       okText={t('ADS_PAGE_LABEL_DELETE_BTN_YES')}
    //       cancelText={t('ADS_PAGE_LABEL_DELETE_BTN_NO')}
    //     >
    //       <Button danger type="link" className="text-red-700" icon={<DeleteOutlined />}>
    //         {t('ADS_PAGE_TABLE_LABEL_DELETE')}
    //       </Button>
    //     </Popconfirm>
    //   ),
    // },
  ];
  /**
   * FUNCTIONS
  */
 const handleInputCommentChange = (e: any) => {
    setComment(e.target.value);
  };
  const handleEditCampaign = (record :any) => {
    router.push(
      `/tasks-campaign/${record.id}/edit`);
  };
  const handleFilterSubmit = (values: any) => {
    setFilters(values);
    setPagination({ ...pagination, current: 1 }); // Reset to first page
  };
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
        setLoading(true);
        let params : any ={
          offset : (pagination.current - 1) * pagination.pageSize,
          limit: pagination.pageSize,
          id: filters.adId,
          owner_id: filters.userId,
          status: filters.status,
          title: filters.title
        }
        const rs = await backendService.getAdsByAdmin(params);
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
      setLoading(false);
    } catch (error) {
      console.log("🚀 ~ initData ~ error:", error)
      setLoading(false);
    }
  },[token, pagination.current, filters]);
      
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
  const handleApprove = async (id: number) => {
    try {
      let params = {
        status: AD_STATUS.active
      }
      await backendService.updateAdsStatusByAdmin(id, params);
      message.success(t('MESSAGE_AD_STATUS_APPROVE_SUCCESS'));
      initData();
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error)
    }
  }
  const handleReject = async (id: number, comment: string) => {
    try {
      let params = {
        status: AD_STATUS.rejected,
        review_comment: comment
      }
      await backendService.updateAdsStatusByAdmin(id, params);
      message.success(t('MESSAGE_AD_STATUS_REJECT'));
      initData();
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error)
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
    <div className={`${cssClass.manageTasksPage}`} >
      <div className="main-page-container">
        <section className="filters-container mb-8">
          <AdsFilterForm onFilterSubmit={handleFilterSubmit} /> 
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

"use client";
import { INVENTORY_TYPES, MAX_PUBLISHER_ITEMS } from "@/constants/common";
import { BackendTokenContext } from "@/hooks/backendTokenContext";
import backendService from "@/services/backend/backend.service";
import { DeleteOutlined, QuestionCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useTonWallet } from '@tonconnect/ui-react';
import { Button, message, Pagination, Popconfirm, Table } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from "react";
import cssClass from "./page.module.scss";
import { useTranslations } from 'next-intl';
export default function InventoryPage() {
  
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
  const { token } = useContext(BackendTokenContext);
  const wallet = useTonWallet();
  const t = useTranslations();
  const columns = [
    {
      title: t('OFFER_WALL_PAGE_TABLE_LABEL_ORDER'),
      key: 'order',
      render:(page : any,payload: any, index: any) => index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: t('OFFER_WALL_PAGE_TABLE_LABEL_TYPE'),
      key: 'type',
      render: (page: any, record: any) => (<> {record.inventory_type === INVENTORY_TYPES.banner ? `Banner`  : record.inventory_type === INVENTORY_TYPES.offerWall ? t('MAIN_HEADER_NAV_LABEL_OFFERWALL') : record.inventory_type === INVENTORY_TYPES.offerWallChallenge ? 'Offer wall challenge' : ''} </>)
    },
    // {
    //   title: t('OFFER_WALL_PAGE_TABLE_LABEL_SIZE'),
    //   key: 'size',
    //   render: (page: any, record: any) => (<> {record.inventory_type === INVENTORY_TYPES.banner ? `${record.size_width}x${record.size_height}`  : ''} </>)
    // },
    // {
    //   title: t('OFFER_WALL_PAGE_TABLE_LABEL_LOCATION'),
    //   key: 'location',
    //     render: (page: any, record: any) => (<> {record.inventory_type === INVENTORY_TYPES.banner ? `${record.location}`  : ''} </>)
    // },
    { title: t('OFFER_WALL_PAGE_TABLE_LABEL_DESCRIPTION'), dataIndex: 'description', key: 'description' },
    {
      title: t('OFFER_WALL_PAGE_TABLE_LABEL_CONNECTED'),  key: 'connected',
      render: (page: any, record: any) => (
        <>
          <div className={`circle ${record.connected ? 'connected' : ''}`}> </div>
      </>)
    },
    {
      title: t('OFFER_WALL_PAGE_TITLE_LABEL_ACTION'),
      key: 'action',
      render: (page : any , record : any) => (
        <div className="flex">
          <Button 
           className="!pl-0"
            type="link" 
            icon={<EditOutlined />}
            onClick={() => router.push(`/tasks-inventory/${record.id}/edit`)}
            style={{ color: '#f97316' }}
          >
            {t('OFFER_WALL_PAGE_TITLE_LABEL_EDIT')}
          </Button>

        <Popconfirm
          title={t('OFFER_WALL_PAGE_LABEL_DELETE_CONFIRM')}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => handleDelete(record.id)}
          okText={t('OFFER_WALL_PAGE_LABEL_DELETE_BTN_YES')}
          cancelText={t('OFFER_WALL_PAGE_LABEL_DELETE_BTN_NO')}
        >
          <Button danger type="link" className="text-red-700 !pl-0" icon={<DeleteOutlined />}>
            {t('OFFER_WALL_PAGE_TABLE_LABEL_DELETE')}
          </Button>
        </Popconfirm>
        </div>
      ),
    },
  ];
  /**
   * FUNCTIONS
  */
  const handleEdit = (record :any) => {
    
    router.push(
      `/tasks-inventory/${record.id}/edit`);
  };
  const createAds = () => {
    if(pagination.total > MAX_PUBLISHER_ITEMS) {
      return;
    }
    router.push("/tasks-inventory/create")
  }
  const handleDelete = async (id: number) => {
    try {
      await backendService.postDeleteInventory(id);
      message.success(t('MESSAGE_OFFER_WALL_DELETE_SUCCESS'));
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
        const rs = await backendService.getInventories(params);
        const paginatedData = rs?.items?.map((item: any) => { 
          let size = 'Full page';
          if (!item.is_fullsize) {
            size = `${item.size_width}x${item.size_height}`;
          }
          return {
            ...item,
            size: size,
            description: item.description,
            conversionPoint: item.conversion_point_type,
            points: item.reward_point,
            rewardDesc: item.reward_info
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
  },[token, pagination.current])
   const handlePageChange = (page:number, pageSize: number) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize
    });
   };
  
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
    <div className={`flex min-h-screen flex-col items-center xl:p-24 xs:p-4 ${cssClass.inventoryPage}`} >
      <h1 className="text-2xl font-bold pt-4">{t('OFFER_WALL_PAGE_TITLE')}</h1>
      <div className="main-page-container mt-4 mb-4"> 
        <div className='header-content flex items-center justify-between'>
          <div className="title font-bold"> {t('OFFER_WALL_PAGE_CARD_TITLE')} </div>
          <div className="btn-actions">  
            <Button type="primary" onClick={createAds}>{t('OFFER_WALL_PAGE_BTN_CREATE') }</Button>
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

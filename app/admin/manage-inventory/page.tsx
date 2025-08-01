"use client";
import { Table, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import backendService from '@/services/backend/backend.service';

export default function ManageInventoryPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Button type="link" onClick={() => router.push(`/admin/manage-inventory/${record.id}`)}>
          View Details
        </Button>
      ),
    },
  ];

  // const fetchInventory = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const response = await backendService.getInventory();
  //     setList(response.items || []);
  //   } catch (error: any) {
  //     message.error('Failed to fetch inventory items');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchInventory();
  // }, [fetchInventory]);

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Manage Inventory</h1>
        <Button type="primary" onClick={() => router.push('/admin/manage-inventory/create')}>
          Create New Item
        </Button>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={list}
        rowKey="id"
      />
    </div>
  );
}

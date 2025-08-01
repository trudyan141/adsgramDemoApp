"use client";

import { useCallback, useContext, useEffect, useState, useRef } from "react";
import backendService from "@/services/backend/backend.service";
import cssClass from "./bot-token-form.module.scss";
import { LeftCircleOutlined, EyeOutlined, QuestionCircleOutlined,DeleteOutlined, EyeInvisibleOutlined, CopyOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { truncateStringToRowsWithFont } from "@/utils/common";
import { Button, Card, Form, Input, message,Popconfirm, Spin } from 'antd';

type Props = {
  taskForm: any
  hasBotToken?: boolean
  onSubmit: () => void
};
export default function BotTokenForm({taskForm, hasBotToken,onSubmit}: Props ) {
  /**
   * STATES
   * */
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();

  /**
   * HOOKS
   */
  const t = useTranslations();


  /**
   * FUNCTIONS
   */
  const fetchBotToken = async () => {
    setLoading(true);
    try {
      // const response = await backendService.getBotToken();
      if(hasBotToken){
        const response = { token: "bot token is not returned to show" };
        if (response && response.token) {
          setToken(response.token);
          form.setFieldsValue({ token: response.token });
        }
      }else{
        setToken('');
        form.setFieldsValue({ token: '' });
      }
    } catch (error) {
      console.error("Error fetching bot token:", error);
      message.error(t('BOT_TOKEN_FETCH_ERROR'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToken = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const id = taskForm?.id;
      let params = {
        token: values.token
      }
      console.log("🚀 ~ handleSaveToken ~ params:", params)
      await backendService.updateBotToken(id,params);
      message.success(t('BOT_TOKEN_SAVE_SUCCESS'));
      fetchBotToken();
      onSubmit();
    } catch (error) {
      console.error("Error saving bot token:", error);
      message.error(t('BOT_TOKEN_SAVE_ERROR'));
    } finally {
      setLoading(false);
    }
  };


  const toggleShowToken = () => {
    setShowToken(!showToken);
  };
  const handleRemoveToken = async () => {
    try {
      setLoading(true);
      const id = taskForm?.id;
      await backendService.deleteBotToken(id);
      message.success(t('BOT_TOKEN_REMOVE_SUCCESS'));
      fetchBotToken();
      onSubmit();
    } catch (error) {
      console.error("Error removing bot token:", error);
      message.error(t('BOT_TOKEN_REMOVE_ERROR'));
    }
  }

  /**
   * USE EFFECTS
   */
  useEffect(() => {
    setIsMounted(true);
    fetchBotToken(); // just to show ****
    onSubmit();
    console.log("🚀 ~ useEffect ~ hasBotToken:", hasBotToken)
    // Create script on initial load to display if token exists
    return () => {
      setIsMounted(false);
    };
  }, [hasBotToken]);

  /**
   * RENDERS
   */
  return (
    <div className={`${cssClass.BotTokenForm}`}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Card
            title={t('BOT_TOKEN_TITLE')}
            bordered={false}
            extra={
              <>{hasBotToken && <Popconfirm
                title={t('BOT_TOKEN_DELETE_CONFIRM')}
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => handleRemoveToken()}
                okText={t('ADS_PAGE_LABEL_DELETE_BTN_YES')}
                cancelText={t('ADS_PAGE_LABEL_DELETE_BTN_NO')}
              >
                <Button danger   type="link" className="text-red-700" icon={<DeleteOutlined />}>
                </Button>
              </Popconfirm>}</>
            }
          > {taskForm?.id ?
            <Form form={form} layout="vertical" onFinish={handleSaveToken}>
                <div className="mb-4">
                  <div className="generate-script">
                    {/* <Button
                      type="primary"
                      className="ml-2 mb-4"
                      icon={<CopyOutlined />}
                      onClick={copyToClipboard}
                      disabled={!hasBotToken}
                    >
                      {t('BOT_TOKEN_COPY')}
                    </Button> */}
                    
                </div>
                <label className="font-medium">{t('BOT_TOKEN_LABEL')}:</label>
                <div className="flex mt-2">
                  <Form.Item
                    name="token"
                    className="flex-grow !mb-0"
                    rules={[{ required: true, message: t('BOT_TOKEN_REQUIRED') }]}
                  >
                    <Input.Password
                      visibilityToggle={false}
                      type={showToken ? "text" : "password"}
                      placeholder={t('BOT_TOKEN_PLACEHOLDER')}
                      disabled={loading}
                      suffix={
                        <span onClick={toggleShowToken} className="cursor-pointer">
                          {showToken ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        </span>
                      }
                    />
                  </Form.Item>
                
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  {t('BOT_TOKEN_SAVE')}
                </Button>
                {/* <>
                  {hasBotToken ? 
                    <Popconfirm
                        title={t('BOT_TOKEN_DELETE_CONFIRM')}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={() => handleRemoveToken()}
                        okText={t('ADS_PAGE_LABEL_DELETE_BTN_YES')}
                        cancelText={t('ADS_PAGE_LABEL_DELETE_BTN_NO')}
                      >
                        <Button danger   type="primary" className="text-red-700" icon={<DeleteOutlined />}>
                          {t('OFFER_WALL_PAGE_TABLE_LABEL_DELETE')}
                        </Button>
                    </Popconfirm> 
                    :
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                    >
                      {t('BOT_TOKEN_SAVE')}
                    </Button>
                  }
                </> */}
                
                </div>
          
              </Form> : <div className="text-center mt-2">{ t('BOT_TOKEN_TITLE_WARNING') }</div>}
              </Card>
            </div>
      </div>
    </div>
  );
}

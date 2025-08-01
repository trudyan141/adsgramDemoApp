
import { INVENTORY_BANNERS_LOCATIONS, INVENTORY_TYPES } from "@/constants/common";
import backendService from "@/services/backend/backend.service";
import { Button, Card, Form, Input, InputNumber, message, Radio, Tooltip } from 'antd';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import {
 InfoCircleOutlined 
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
export default function InventoryForm({ offerWallInfo, ...props }: any) {
   /**
   * STATES
   * */
  const [inventoryType, setInventoryType] = useState(INVENTORY_TYPES.offerWall);
  const [formValues, setFormValues] = useState<any>(null);
  const { TextArea } = Input;
  const [step, setStep] = useState(1);
  /**
   * HOOKS
   */
  const router = useRouter();
  const [form] = Form.useForm();
  const t = useTranslations();
  /**
   * FUNCTIONS
   */
   const handleNext = () => {
    form.validateFields().then(values => {
      setFormValues(values);
      setStep(2);
    });
  };

  const handleBack = () => {
    setStep(1);
  };
  const handleSubmit = async (values: any) => {
    try {   
      const location = values.location || 'Top';
      const inventory_type = values.inventoryType;
      let size_width = 1;
      let size_height = 1;
      if(inventory_type === INVENTORY_TYPES.banner){
        size_width = values.sizeWidth;
        size_height = values.sizeHeight;
      }
      let rewardTitle = '';
      if(inventory_type === INVENTORY_TYPES.offerWall){
        rewardTitle = values.rewardTitle;
      }
      if(!offerWallInfo){
      const params = {
        inventory_type: inventory_type,
        size_width: size_width,
        size_height: size_height,
        location: location,
        description: values.description,
        reward_info: rewardTitle
      }
      const rs = await backendService.postInventories(params);
      message.success(t('MESSAGE_OFFER_WALL_CREATE_SUCCESS'));
    } else {
      const params = {
        description: values.description,
        reward_info: rewardTitle,
      }
      const rs = await backendService.patchInventoryById(offerWallInfo.id, params);
      message.success(t('MESSAGE_OFFER_WALL_UPDATE_SUCCESS'));
    }
      // Navigate to another page after successful inventory creation
      router.push('/tasks-inventory');
    } catch (error : any) {
      console.log("🚀 ~ handleSubmit ~ error:", error)
      message.error(error?.response?.data?.message
        || error?.data?.message 
        || error?.message
        || error.toString());
    }
  }
  const mapFormValues = (offerWallInfo: any) => {
    form.setFieldsValue({
      inventoryType: offerWallInfo.inventory_type,
      sizeWidth: offerWallInfo.size_width,
      sizeHeight: offerWallInfo.size_height,
      location: offerWallInfo.location,
      description: offerWallInfo.description,
      rewardTitle: offerWallInfo.reward_info,
    });
  }
  /**
   * USE EFFECTS
   */
  useEffect(() => {
    if (offerWallInfo) {
      mapFormValues(offerWallInfo);
    }
  }, [offerWallInfo])

  return (
    <div className="tasks-form">
      {step === 1 && <Card title={ offerWallInfo ? t('OFFER_WALL_EDIT_PAGE_CARD_FORM_TITLE') : t('OFFER_WALL_CREATE_PAGE_CARD_FORM_TITLE')} bordered={false}>
        <Form form={form} layout="vertical" onFinish={handleNext}  initialValues={{ inventoryType: INVENTORY_TYPES.offerWall, location: INVENTORY_BANNERS_LOCATIONS.top }}>
          {/* <h1 className="text-2xl font-bold pt-4 mb-4">Inventory: </h1> */}
          <Form.Item label={t('OFFER_WALL_CREATE_PAGE_CARD_FORM_TYPE')} name="inventoryType" rules={[{ required: true, message: t('VALIDATE_REQUIRED')  }]}>
            <Radio.Group value={inventoryType} onChange={(e) => setInventoryType(e.target.value)}>
              {/* <Radio value={INVENTORY_TYPES.banner }>Banner</Radio> */}
              <Radio value={INVENTORY_TYPES.offerWall}>{t('OFFER_WALL_CREATE_PAGE_CARD_FORM_TYPE_OFFER_WALL') }</Radio>
              {/* <Radio value={INVENTORY_TYPES.offerWallChallenge }>Offer wall Challenge</Radio> */}
            </Radio.Group>
          </Form.Item>
          {inventoryType === INVENTORY_TYPES.banner && (
            <>
            <Form.Item label={
                <span>
                  Banner Width (px) 
                </span>
              }
              name="sizeWidth" rules={[{ required: true, message: t('VALIDATE_REQUIRED') }]}>
              <InputNumber  style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Banner Height (px)" name="sizeHeight" rules={[{ required: true, message: t('VALIDATE_REQUIRED') }]}>
              <InputNumber  style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Location" name="location" rules={[{ required: true, message: t('VALIDATE_REQUIRED') }]}>
              <Radio.Group>
                <Radio value={INVENTORY_BANNERS_LOCATIONS.top }>Top</Radio>
                <Radio value={INVENTORY_BANNERS_LOCATIONS.middle}>Middle</Radio>
                <Radio value={INVENTORY_BANNERS_LOCATIONS.bottom}>Bottom</Radio>
              </Radio.Group>
              </Form.Item>
              </>
          )}
          {inventoryType === INVENTORY_TYPES.offerWall && (
            <>
              <Form.Item label={
                <span>
                  {t('OFFER_WALL_CREATE_PAGE_CARD_FORM_LABEL_REWARD')}
                  <Tooltip title={t('OFFER_WALL_CREATE_PAGE_CARD_FORM_TOOLTIP_REWARD')}>
                    <InfoCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              } name="rewardTitle" rules={[{ required: true, message: t('VALIDATE_REQUIRED') }]}>
                <Input />
              </Form.Item>
            </>
          )}
          <Form.Item label={
                <span>
                  {t('OFFER_WALL_CREATE_PAGE_CARD_FORM_LABEL_DESCRIPTION')}
                  <Tooltip title={t('OFFER_WALL_CREATE_PAGE_CARD_FORM_TOOLTIP_DESCRIPTION')}>
                    <InfoCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              } name="description" rules={[{ required: true, message: t('VALIDATE_REQUIRED') }]}>
            <TextArea rows={4} />
          </Form.Item>
        
          <Button type="primary" htmlType="submit">
            {t('OFFER_WALL_CREATE_PAGE_BTN_NEXT')}
          </Button>
        </Form>
      </Card>}
       {step === 2 && formValues && <Card title={t('OFFER_WALL_CREATE_PAGE_CARD_CONFIRM')} bordered={false}>
        <p className="mb-4"><strong>{t('OFFER_WALL_CREATE_PAGE_CARD_FORM_TYPE')}:</strong> {formValues?.inventoryType === INVENTORY_TYPES.banner ? 'Banner' : 'Offer Wall'}</p>
        {formValues?.inventoryType === INVENTORY_TYPES.banner && (
          <>
            <p className="mb-4"> <strong>Size (px):</strong> {formValues?.sizeWidth}x{formValues?.sizeHeight}</p>
            <p className="mb-4"> <strong>Location:</strong> {formValues?.location}</p>
          </>
        )}
        {formValues?.inventoryType === INVENTORY_TYPES.offerWall && (
          <>
            <p className="mb-4"><strong>{t('OFFER_WALL_CREATE_PAGE_CARD_FORM_LABEL_REWARD')}:</strong> {formValues?.rewardTitle}</p>
          </>
        )}
        <p className="mb-4"><strong>{t('OFFER_WALL_CREATE_PAGE_CARD_FORM_LABEL_DESCRIPTION')}:</strong> {formValues?.description}</p>
        <div className="mt-4"> 
          <Button className="mr-4" onClick={handleBack}>{t('OFFER_WALL_CREATE_PAGE_BTN_BACK') }</Button>
            <Button  style={offerWallInfo ? { backgroundColor: '#f97316', color: 'white' } : undefined}
            type="primary" onClick={() => handleSubmit(formValues)}>
              { offerWallInfo ? t('OFFER_WALL_PAGE_TITLE_LABEL_EDIT') : t('OFFER_WALL_CREATE_PAGE_BTN_CREATE')} 
            </Button>
        </div>
      
      </Card>}
    </div>
  );
}

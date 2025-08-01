import { INVENTORY_BANNERS_CONVERSIONS, IMAGE_UPLOAD_SIZES, TASK_TYPES } from '@/constants/common';
import { BackendTokenContext } from "@/hooks/backendTokenContext";
import backendService from "@/services/backend/backend.service";
import domainService from "@/services/domain.service";
import { UploadOutlined, LoadingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, InputNumber, message, Spin, Upload, Collapse, Select, Tooltip } from 'antd';
const { Search } = Input;
const { Option } = Select;
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState, useCallback } from "react";
import BannerPreview from './banner-preview.component';
import BotTokenForm from './bot-token-form.component';
import cssClass from './adsForm.module.scss';
import { useTranslations } from 'next-intl';
//import debounce from 'lodash/debounce';
import { debounce } from '@/utils/common'
import CodeBlock from "@/components/codeBlock/CodeBlock";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { BANNER_CODE_URL } from "@/constants/bannerCode";
export default function AdsForm({ adsInfo, onReload, ...props }: any) {
   /**
   * STATES
   * */
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);
  const [domainImageInfo, setDomainImageInfo] = useState<any>(null);
  const [isResize, setIsResize] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  const [step, setStep] = useState(1);
  const { TextArea } = Input;
  const [resizeLoading, setResizeLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<any>(IMAGE_UPLOAD_SIZES[0].name);
  const [titleCheckLoading, setTitleCheckLoading] = useState(false);
  const [isTitleUnique, setIsTitleUnique] = useState(true);
  const [scriptContent, setScriptContent] = useState('');
  /**
   * HOOKS
   */
  const router = useRouter();
  const [form] = Form.useForm();
  const { token } = useContext(BackendTokenContext);
  const t = useTranslations();
  /**
   * FUNCTIONS
   */
   const createScript = () => {
    let script = '';
    let stringStore:any = localStorage?.getItem('sdk_dmtp');
    let sdk_dmtp:any = JSON.parse(stringStore);
    const { wallet_hash } = sdk_dmtp?.auth || {};
    const task_title_encoded = encodeURIComponent(adsInfo.alt);
    const src_link = `${BANNER_CODE_URL}?walletAddress=${wallet_hash}&task_id=${adsInfo.id}&task_title=${task_title_encoded}`;
    console.log("🚀 ~ createScript ~ src_link:", src_link)
    script = `<script src="${src_link}"></script>`;
    return script;
  };
  const beforeUpload = (file:any) => {
    return new Promise((resolve, reject) => {
      const isPng = file.type === 'image/png';
      if (!isPng) {
        message.error(t('MESSAGE_UPLOAD_PNG_ONLY'));
        reject();
        return;
      }
      const img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
      const { width, height } = img;
      const isSquare = width === height;
      const inRange = width >= 64 && width <= 512 && height >= 64 && height <= 512;

       if (isSquare && inRange) {
        resolve(file);
      } else {
        message.error(t('MESSAGE_UPLOAD_SIZE_REQUIRED'));
        reject();
      }
      };
    });
  };
  const uploadFile = async (file: any) => {
    try {
      const rs = await backendService.postAdsUpload({ file });
      setImageUrl(rs?.url);
    }catch (error) {
      console.log("🚀 ~ uploadFile ~ error:", error)
    }
  }
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
      if (!imageUrl) {
        message.error(t('MESSAGE_BANNER_REQUIRED'));
        return;
      }
      setLoading(true);
      if(!adsInfo){ // create
        const params = {
          "url":  values.targetUrl,
          image_url: imageUrl,
          "alt": values.altText,
          "description": values.description,
          "conversion_point_type": values.conversionPoint,
          "reward_info":values.rewardDesc,
          "reward_point":values.points,
          "task_type": values.taskType || 'Repeating',
        }
        const rs = await backendService.postAds(params);
        console.log("🚀 ~ handleSubmit ~ rs:", rs)
        message.success(t('MESSAGE_AD_CREATE_SUCCESS'));
      }else{ // edit
        const params = {
          "url": values.targetUrl,
          image_url: imageUrl,
          "alt": values.altText,
          "description": values.description,
          "conversion_point_type": values.conversionPoint,
          "reward_info": values.rewardDesc,
          "reward_point": values.points,
          "task_type": values.taskType || 'Repeating',
        }
        const rs = await backendService.patchAdsById(adsInfo.id, params);
        console.log("🚀 ~ handleSubmit edit ~ rs:", rs)
        message.success(t('MESSAGE_AD_UPDATE_SUCCESS'));
      }

      // Navigate to another page after successful campaign creation
      router.push('/tasks-campaign');
    } catch (error : any) {
      console.log("🚀 ~ handleSubmit ~ error:", error)
      message.error(t(error?.response?.data?.message
        || error?.data?.message 
        || error?.message
        || error.toString()));
    }
    finally {
      setLoading(false);
    }
     
  };

  
  const checkTitleUniqueness = async (title: string) => {
    if (!title) {
      setIsTitleUnique(true);
      return;
    }
    
    setTitleCheckLoading(true);
    try {
      // Call the API to check if the title is unique
      // const response = await backendService.checkTitleUnique(title);
      // console.log("🚀 ~ checkTitleUniqueness ~ response:", response)
      // setIsTitleUnique(response?.isUnique);
      setIsTitleUnique(true);
    } catch (error) {
      console.error("Error checking title uniqueness:", error);
      // Default to true in case of error to not block the user
      setIsTitleUnique(true);
    } finally {
      setTitleCheckLoading(false);
    }
  };
  

  
  // Debounced version of the check function
  const debouncedCheckTitle = useCallback(debounce(checkTitleUniqueness, 500),[]);

  const handleFormChange = (changedValues: any, allValues: any) => {
    setFormValues(allValues); 
  }

  const fetchDomainInfo = async (url: string) => {
    if (!url) return;
    setMetadata(null); // domainInfo
    setDomainImageInfo(null); // reset domainImageInfo
    setLoading(true);
    try {
      const domainInfo = await domainService.getDomainInfo(url);
      if (domainInfo) {
        setMetadata(domainInfo);
        setFormValues((prevValues : any) => ({
          ...domainInfo,
          ...prevValues,
          altText: domainInfo.title,
          description: domainInfo.description,
        }));
        // form.setFieldsValue({
        //   altText: domainInfo.title,
        //   description: domainInfo.description,
        // });
        const imageUrl = domainInfo.image || domainInfo.favicon;
        const imageInfo = await domainService.resizeImageFromUrl(imageUrl);
        if(imageInfo){
          setDomainImageInfo(imageInfo); // for show widthxheight
          const isCanUpload = IMAGE_UPLOAD_SIZES.find((size) => {
            return size.width === imageInfo.width && size.height === imageInfo.height;
          });
          if(isCanUpload){
            const imageResizeInfo = await domainService.resizeImageFromUrl(imageUrl, imageInfo.width, imageInfo.height, true);      
            const imageResizeUrl = imageResizeInfo?.url;
            if(imageResizeUrl){  
              setImageUrl(imageResizeUrl);
            }
            setIsResize(false);
          }else{
            setIsResize(true);
          }
        }
        message.success(t('MESSAGE_DOMAIN_FETCH_SUCCESS'));
      }else{
        throw new Error(t('MESSAGE_DOMAIN_FETCH_FAILED'));
      }
    } catch (error) {
      console.error('Error fetching game info:', error);
      message.error(t('MESSAGE_DOMAIN_FETCH_FAILED'));
    } finally {
      setLoading(false);
    }
  };
  const handleResize = async () => {
    setResizeLoading(true); // Start loading
    try {
      const size = IMAGE_UPLOAD_SIZES.find(s => s.name === selectedSize);
      if (size) {
       
        const imageInfo = await domainService.resizeImageFromUrl(metadata.image, size.width, size.height, isResize);      
        const imageResizeUrl = imageInfo?.url;
        const imageResizeInfo = await domainService.resizeImageFromUrl(imageResizeUrl);
        if(imageResizeInfo){  
          setDomainImageInfo(imageResizeInfo); // for show widthxheight
          setImageUrl(imageResizeUrl);
        }
      }
      message.success(t('MESSAGE_IMAGE_RESIZE_SUCCESS'));
    } catch (error : any) {
      console.error('Error resizing image:', error);
      message.error(t(error?.response?.data?.message
        || error?.data?.message 
        || error?.message
        || error.toString()));
    } finally {
      setResizeLoading(false); // Stop loading
    }
  };
  const mapFormValues = (adsInfo: any) => {
    console.log("🚀 ~ mapFormValues ~ adsInfo:", adsInfo)
    // form.setFieldsValue({
    //   targetUrl: adsInfo?.url,
    //   altText: adsInfo?.alt,
    //   description: adsInfo?.description,
    //   conversionPoint: adsInfo?.conversion_point_type,
    //   rewardDesc: adsInfo?.reward_info,
    //   points: adsInfo?.reward_point,
    // });
    setFormValues((prevValues : any) => ({
      ...adsInfo,
      ...prevValues,
      targetUrl: adsInfo.url,
      altText: adsInfo.alt,
      rewardDesc: adsInfo.reward_info,
      description: adsInfo.description,
      taskType: adsInfo.task_type || 'Repeating',
    }));
    setImageUrl(adsInfo?.image_url);
  }
  const getTaskType = (taskType : string) => {
    const findTask = TASK_TYPES.find(t => t.value === taskType);
    console.log("🚀 ~ getTaskType ~ findTask:", findTask)
    return findTask;
  }
  const botTokenSubmit = () => {
    console.log("🚀 ~ botTokenSubmit ~ botTokenSubmit:")
    onReload();
  }
  /**
   * USE EFFECTS
   */
  useEffect(() => {
    if (formValues) {
      console.log("🚀 ~ useEffect ~ formValues:", formValues)
      form.setFieldsValue({
        ...formValues
      });
    }
  }, [formValues])
  useEffect(() => {
    if (adsInfo) {
      mapFormValues(adsInfo);
    }
  }, [adsInfo])
  useEffect(() => {
    if (adsInfo?.id) {
      const script = createScript();
      setScriptContent(script);
    }
  }, [adsInfo?.id]);
  return (
    <div className={`tasks-form ${cssClass.TasksForm}`}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 md:w-2/3">
           {step === 1 && (
              <Card title={ adsInfo ? t('ADS_EDIT_PAGE_CARD_FORM_TITLE') : t('ADS_CREATE_PAGE_CARD_FORM_TITLE')} bordered={false}>
              <Form form={form} layout="vertical"
                initialValues={{ conversionPoint: INVENTORY_BANNERS_CONVERSIONS.click , points: 1, taskType: 'Repeating' }}
                onValuesChange={handleFormChange} 
                onFinish={handleNext}>
                    <Form.Item className='!mb-2' label={t('ADS_CREATE_PAGE_CARD_FORM_LABEL_TARGET_URL')} name="targetUrl" rules={[
                    {
                      pattern: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/,
                      message: 'Please enter a valid domain URL (e.g., https://example.com)'
                    }
                  ]}>
                    <Search
                      placeholder="Enter a valid domain URL (e.g., https://example.com)"
                      enterButton={loading ? <LoadingOutlined /> : t('OFFER_WALL_CREATE_PAGE_BTN_GET_INFO')}
                      onSearch={(value) => fetchDomainInfo(value)}
                    />
                   
                  </Form.Item>

                  {metadata && (
                    <Collapse className='custom-collapse mb-2' defaultActiveKey={['1']}>
                    <Collapse.Panel header={<span className="custom-collapse-header">{t('OFFER_WALL_CREATE_PAGE_DOMAIN_INFO')}</span>} key="1">
                      <div className="bg-gray-50 rounded domain-info-container flex">
                        <div className="flex-shrink-0 w-2/5"> {/* Set width to 60% */}
                        {domainImageInfo?.url && (
                            <div className="flex flex-col items-center"> {/* Center the content */}
                             <div className='image-container w-full relative'> 
                                {resizeLoading && (
                                    <Spin className='image-spin' /> // Show loading spinner
                                  ) }
                                    <img 
                                      width="100%"
                                      src={domainImageInfo?.url} 
                                      alt="domain Preview" 
                                      className={`max-w-full rounded ${resizeLoading ? 'opacity-50' : ''}`} // Adjust opacity
                                    />
                                
                             </div>
                           
                              {domainImageInfo && (
                                <div className="image-info text-center"> {/* Center the domain info */}
                                  <p><strong>og:image</strong> ({domainImageInfo.width} x {domainImageInfo.height})</p> {/* Display width and height */}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex flex-col w-3/5"> {/* Set width to 40% */}
                          {metadata.title && (
                            <p><strong>{t('ADMIN_PAGE_ADS_LIST_FORM_TITLE_TITLE')}:</strong> {metadata.title}</p>
                          )}
                          {metadata.description && (
                            <p><strong>{t('OFFER_WALL_PAGE_TABLE_LABEL_DESCRIPTION')}:</strong> {metadata.description}</p>
                          )}
                          {metadata.favicon && (
                            <div className="mt-2 flex items-center">
                              <p><strong>Favicon:</strong></p> {/* Title for favicon */}
                              <img 
                                src={metadata.favicon} 
                                alt="Favicon" 
                                className="rounded ml-2" 
                                style={{ width: '24px', height: '24px' }} // Set size to 24x24
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      {isResize && (
                        <div className="bg-gray-50 p-4 pt-0">
                          <div className="text-sm text-orange-500">
                            {t('OFFER_WALL_CREATE_PAGE_WARNING_RESIZE')}
                          </div>
                          <div className="resize-form flex items-center mt-2">
                            <Select
                              defaultValue={IMAGE_UPLOAD_SIZES[0].name} // Set default size
                              style={{ width: 120, marginRight: '8px' }} // Adjust width as needed
                              onChange={(value) => setSelectedSize(value)} // Handle size selection
                            >
                              {IMAGE_UPLOAD_SIZES.map((size) => (
                                <Option key={size.name} value={size.name}>
                                  {size.name}
                                </Option>
                              ))}
                            </Select>
                            <Button
                              danger
                              loading={resizeLoading}
                              onClick={handleResize} // Handle resize action
                            >
                              {t('OFFER_WALL_CREATE_PAGE_BTN_RESIZE')}
                            </Button>
                          </div>
                        </div>
                      )}
                    </Collapse.Panel>
                  </Collapse>
                  )}
              
                  <Form.Item label={t('ADS_CREATE_PAGE_CARD_FORM_LABEL_BANNER_IMAGE')}>
                <Upload
                  listType="picture"
                  beforeUpload={() => false}
                  fileList={fileList}
                  onChange={info => {
                    const { file, fileList } = info;
                    beforeUpload(file)
                      .then(() => {
                          uploadFile(file);
                    })
                      .catch(() => setFileList([]));
                  }}
                >
                    <Button icon={<UploadOutlined />}>{t('ADS_CREATE_PAGE_CARD_FORM_BTN_UPLOAD_BANNER') }</Button>
                    <div className="image-warning mt-4 text-sm text-orange-500  ">{ t('ADS_CREATE_PAGE_CARD_FORM_UPLOAD_WARNING') } </div>
                  </Upload>
                  {imageUrl && <div className="image-preview mt-4" >
                    <img  src={imageUrl} alt="Upload Preview"/>
                  </div>
                  }
                </Form.Item>
                <Form.Item label={
                    <span>
                      {t('ADS_CREATE_PAGE_CARD_FORM_LABEL_TITLE')}
                      <Tooltip title={t('ADS_CREATE_PAGE_TITLE_TOOLTIP_LABEL')}>
                        <InfoCircleOutlined style={{ marginLeft: 8 }} />
                      </Tooltip>
                    </span>
                  } name="altText" 
                  rules={[
                    { required: true, message: t('VALIDATE_REQUIRED') },
                    { validator: (_, value) => {
                      if (!isTitleUnique) {
                        return Promise.reject(t('ADS_CREATE_PAGE_TITLE_NOT_UNIQUE'));
                      }
                      return Promise.resolve();
                    }}
                  ]}
                  validateStatus={!isTitleUnique ? 'error' : undefined}
                  help={!isTitleUnique ? t('ADS_CREATE_PAGE_TITLE_NOT_UNIQUE') : undefined}
                >
                  <Input 
                    onChange={(e) => {
                      const value = e.target.value;
                      debouncedCheckTitle(value);
                    }}
                    suffix={titleCheckLoading ? <LoadingOutlined /> : null}
                  />
                </Form.Item>
                  <Form.Item label={
                    <span>
                      {t('ADS_CREATE_PAGE_CARD_FORM_LABEL_DESCRIPTION')}
                      <Tooltip title={t('ADS_CREATE_PAGE_DESCRIPTION_TOOLTIP_LABEL')}>
                        <InfoCircleOutlined style={{ marginLeft: 8 }} />
                      </Tooltip>
                    </span>
                  } name="description" rules={[{ required: true, message: t('VALIDATE_REQUIRED') }]}>
                    <TextArea rows={4} />
                  </Form.Item>

                  <Form.Item  style={{ display: 'none' }} name="conversionPoint" rules={[{ required: true, message: t('VALIDATE_REQUIRED') }]}>
                  
                  </Form.Item>
                  {/* <h1 className="text-2xl font-bold pt-4 mb-4 mt-8"> Reward Info: </h1> */}
                  <Form.Item  style={{ display: 'none' }} label="Points per Conversion" name="points" rules={[{ required: true , message: t('VALIDATE_REQUIRED')}]}>
                    <InputNumber disabled max={100} min={1} style={{ width: '100%' }}  />
                  </Form.Item>
                  <Form.Item  label={
                    <span>
                      {t('ADS_PAGE_TABLE_LABEL_REWARD_CTA')}
                      <Tooltip title={t('ADS_CREATE_PAGE_REWARD_TOOLTIP_LABEL')}>
                        <InfoCircleOutlined style={{ marginLeft: 8 }} />
                      </Tooltip>
                    </span>
                  } name="rewardDesc" rules={[{ required: true, message: t('VALIDATE_REQUIRED') }]}>
                    <TextArea rows={2} />
                  </Form.Item>
                  <Form.Item
                    name="taskType"
                    label={t('ADS_CREATE_PAGE_TASK_TYPE_LABEL')}
                    initialValue="Repeating"
                    rules={[{ required: true, message: t('VALIDATE_REQUIRED') }]}
                  >
                    <Select>
                      {TASK_TYPES.map(type => (
                        <Option key={type.value} value={type.value}>
                          {t(type.label)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Button type="primary" htmlType="submit">
                    { t('ADS_CREATE_PAGE_CARD_FORM_LABEL_BTN_NEXT')}
                  </Button>
                </Form>
            </Card>
          )}
          {step === 2 && (
            <Card title={t('ADS_CREATE_PAGE_CARD_CONFIRM_AD')} bordered={false}>
              <p className="mb-4"><strong>{t('ADS_CREATE_PAGE_CARD_FORM_LABEL_BANNER_IMAGE')}:</strong> <img src={imageUrl} alt="Banner" /></p>
              <p className="mb-4"><strong>{t('ADS_CREATE_PAGE_CARD_FORM_LABEL_TARGET_URL')}:</strong> {formValues.targetUrl}</p>
              <p className="mb-4"><strong>{t('ADS_CREATE_PAGE_CARD_FORM_LABEL_TITLE')}:</strong> {formValues.altText}</p>
              <p className="mb-4"><strong>{t('ADS_CREATE_PAGE_CARD_FORM_LABEL_DESCRIPTION')}:</strong> {formValues.description}</p>
              {/* <p className="mb-4"><strong>Conversion Point:</strong> {formValues.conversionPoint}</p> */}
              {/* <p className="mb-4"><strong>Points per Conversion:</strong> {formValues.points}</p> */}
              <p className="mb-4"><strong>{t('ADS_PAGE_TABLE_LABEL_REWARD_CTA')}:</strong> {formValues.rewardDesc}</p>
              <p className="mb-4"><strong>{t('ADS_CREATE_PAGE_TASK_TYPE_LABEL')}:</strong> {t(getTaskType(formValues.taskType)?.label)}</p>
              {adsInfo && <p className="mb-4" style={{ color: '#f97316' }}><strong className='mr-1'>{t('ADS_PAGE_WARNING_TITLE')}:</strong> 
                {t.rich('ADS_PAGE_WARNING_EDIT_WARNING', {
                  span: (children) => <span className="font-semibold">{children}</span> 
                })}
              </p>}
             
              
              <div className="mt-4"> 
                <Button className="mr-4" onClick={handleBack}>{t('ADS_CREATE_PAGE_BTN_BACK') }</Button>
                <Button type="primary" disabled={loading}  style={adsInfo ? { backgroundColor: '#f97316', color: 'white' } : undefined} onClick={() => handleSubmit(formValues)}>
                  { loading && <Spin indicator={<LoadingOutlined spin />} /> } { adsInfo ? t('ADS_PAGE_TABLE_LABEL_EDIT') : t('ADS_CREATE_PAGE_BTN_CREATE')} 
                </Button>
              </div>
            </Card>
          )}
          {scriptContent && (
            <div className="import-script-container mt-4">
              <Card title={t('EDIT_PAGE_IMPORT_SCRIPT')} bordered={false}>
                <div className="script-snippets ">
                  <div className="code-snippet-code">
                    <CodeBlock language="htmlbars" code={scriptContent} style={a11yDark} />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        <div className="md:w-1/3">
          <div className="sticky top-4 banner-preview">
            <Card title={t('ADS_CREATE_PAGE_CARD_PREVIEW_TITLE')} bordered={false}>
              <div className="mb-2"> {t('ADS_PAGE_PREVIEW_CARD_CLICK_SHOW_DETAIL')} </div>
              <BannerPreview form={formValues} imgUrl={imageUrl} />
            </Card>
            <BotTokenForm  taskForm={adsInfo} hasBotToken={adsInfo?.has_bot_token} onSubmit={botTokenSubmit} />
          
          </div>
       
        </div>
      </div>
     
    </div>
  );
}


"use client";
import { useState, useEffect } from "react";
import CodeSnippet from "../CodeSnippet";
import { advertisers } from "./code_snippet";
import { sdk_embedding } from "../general/code_snippet";
import cssClass from "./sp-advertisers.module.scss";
import type { CollapseProps} from 'antd';
import { Collapse, Tabs , Radio } from 'antd';
const { TabPane } = Tabs;
import { BANNER_CODE_URL, BACKEND_API_URL } from "@/constants/bannerCode";
import { useTranslations } from 'next-intl';
import {GITHUB_LINKS} from '@/constants/common';
import ImportantNote from "@/components/common/ImportantNote";
import SafeHtmlComponent from '@/components/safeHtml/safe-html.component';
export default function SpAdvertisersComponent() {
    /**
     * STATES
     */
    const [walletHash, setWalletHash] = useState<string | null>(null);
    const [srcLink, setSrcLink] = useState<string | null>(null);
    const [apiUrl, setApiUrl] = useState<string | null>(null);
    const [nextjsMode, setNextjsMode] = useState<string | null>('app-router');
    const [activeTab, setActiveTab] = useState<string>('vanillajs');
   const handleActiveTab = (key: string) => {
      setActiveTab(key);
    }
    const handleModeChange = (e: any) => {
      console.log("🚀 ~ handleModeChange ~ e:", e)
      const mode = e.target.value;
      setNextjsMode(mode);
    }
    /**
     * HOOKS
     */
    const t = useTranslations();
    /**
     * USE EFFECTS
     */
    useEffect(() => {
        let stringStore:any = localStorage?.getItem('sdk_dmtp');
        let sdk_dmtp:any = JSON.parse(stringStore);
        const { wallet_hash } = sdk_dmtp?.auth || {};
        setWalletHash(wallet_hash)
        const src_link = `${BANNER_CODE_URL}?walletAddress=${wallet_hash}&task_id=1&task_title=test`;
        setSrcLink(src_link);
        const api_url = `${BACKEND_API_URL}/banners/events?wa=${wallet_hash}&offset=0&limit=10`;
        setApiUrl(api_url);
    }, [])
    /**
     * RENDERS
     */
   const renderAppRouter = () => {
      return (
        <>
        <div className="code-snippet">
          <div className="code-snippet-label mb-2">1. {t("SNIPPETS_PAGE_NEXTJS_APP_CREATE_BEC_SCRIPT")}   </div>
          <div className="code-snippet-code">
            {srcLink && <CodeSnippet language="typescript" code_string={sdk_embedding.nextjs.appRouter.scriptComponent(srcLink)} />}
            </div>
            <ImportantNote 
              type="error"
              message={
                 <SafeHtmlComponent htmlContent={t.raw('SNIPPETS_PAGE_IMPORTANT_TASK_PARAMS')} />
              } 
            />
          </div>
        <div className="code-snippet mt-6">
          <div className="code-snippet-label mb-2">2. {t("SNIPPETS_PAGE_NEXTJS_APP_IMPORT_BEC_SCRIPT")}  </div>
          <div className="code-snippet-code">
            {srcLink && <CodeSnippet language="typescript" code_string={sdk_embedding.nextjs.appRouter.import_script} />}
          </div>
          </div>
        </>
      )
    }
    const renderPageRouter = () => {
      return (
        <>
        <div className="code-snippet">
          <div className="code-snippet-label mb-2">1. {t("SNIPPETS_PAGE_NEXTJS_PAGE_IMPORT")} </div>
          <div className="code-snippet-code">
            {srcLink && <CodeSnippet language="typescript" code_string={sdk_embedding.nextjs.pageRouter.import_script(srcLink)} />}
            </div>
            <ImportantNote 
              type="error"
              message={
                <SafeHtmlComponent htmlContent={t.raw('SNIPPETS_PAGE_IMPORTANT_TASK_PARAMS')} />
              } 
            />
          </div>
      
        </>
      )
    }
    const PublishersOfferWallComponent = () => {
      return (
        <div className={`publishers`}>
            <Tabs activeKey={activeTab} onChange={handleActiveTab}  type="card" className="mt-6">
            <TabPane tab="Vanilla JS" key="vanillajs">
                {/* <div className="code-snippet">
                  <div className="code-snippet-label mb-2">1. Embedding snippet (Please check General and vanilla tabs for more details)</div>
                 <div className="code-snippet-code">
                    <CodeSnippet code_string={'Please check General tab for more details'} />
                  </div> 
                </div> */}
                <div className="code-snippet">
                <div className="code-snippet-label mb-2">1. {t("SNIPPETS_PAGE_LABEL_ADD_SCRIPT") }</div>
                  <div className="code-snippet-code">
                  {srcLink && <CodeSnippet code_string={sdk_embedding.vanilla_js.code_string_link(srcLink)} />}
                </div>
                  <ImportantNote 
                  type="error"
                  message={
                    <SafeHtmlComponent htmlContent={t.raw('SNIPPETS_PAGE_IMPORTANT_TASK_PARAMS')} />
                  } 
                />
                </div>
                <div className="code-snippet mt-6">
                <div className="code-snippet-label mb-2">2. {t("SNIPPETS_PAGE_LABEL_CALL_ONLOAD")}</div>
                  <div className="code-snippet-code">
                  {srcLink && <CodeSnippet  code_string={sdk_embedding.vanilla_js.code_string_adding_2} />}
                  </div>
                </div>
                <div className="code-snippet mt-6">
                <div className="code-snippet-label mb-2">3. {t("SNIPPETS_PAGE_LABEL_CALL_REPORT_EVENT") || "Report event after onLoad (Optional for publisher script)"}</div>
                  <div className="code-snippet-code">
                  <CodeSnippet  code_string={sdk_embedding.vanilla_js.code_string_report_event} />
                  </div>
                </div>
                <div className="code-snippet mt-6">
                  <div className="code-snippet-label mb-2">4. {t('SNIPPETS_PAGE_LABEL_EXAMPLE')}</div>
                  <div className="code-snippet-code">
                  {srcLink && <CodeSnippet code_string={advertisers.vanilla_js.code_string_display_offer_wall_example(srcLink, apiUrl)} />}
                  </div>
                </div>
              </TabPane>
            <TabPane tab="React JS" key="reactjs">
              <div className="code-snippet">
                <div className="code-snippet-label mb-2">1. {t("SNIPPETS_PAGE_LABEL_ADD_SCRIPT") }</div>
                  <div className="code-snippet-code">
                  {srcLink && <CodeSnippet code_string={sdk_embedding.react_js.code_string_link(srcLink)} />}
                </div>
                  <ImportantNote 
                    type="error"
                    message={
                      <SafeHtmlComponent htmlContent={t.raw('SNIPPETS_PAGE_IMPORTANT_TASK_PARAMS')} />
                    } 
                  />
              </div>
              <div className="code-snippet mt-6">
                  <div className="code-snippet-label mb-2">2. {t("SNIPPETS_PAGE_LABEL_CALL_ONLOAD") }</div>
                  <div className="code-snippet-code">
                  {srcLink && <CodeSnippet code_string={sdk_embedding.react_js.code_string_adding_2} />}
                  </div>
                </div>
                <div className="code-snippet mt-6">
                  <div className="code-snippet-label mb-2">3. {t("SNIPPETS_PAGE_LABEL_CALL_REPORT_EVENT") || "Report event after onLoad (Optional for publisher script)"}</div>
                  <div className="code-snippet-code">
                  <CodeSnippet  code_string={sdk_embedding.react_js.code_string_report_event} />
                  </div>
                </div>
                
                <div className="code-snippet mt-6">
                  <div className="code-snippet-label mb-2">4. {t('SNIPPETS_PAGE_LABEL_EXAMPLE')}</div>
                  <div className="code-snippet-code">
                  {srcLink && <CodeSnippet language="jsx" code_string={advertisers.react_js.code_string_display_offer_wall_example(srcLink,apiUrl)} />}
                  </div>
                </div>
            </TabPane>
             <TabPane tab="Nextjs" key="nextj">
                <h1 className="text-base text-warning font-bold mb-4">{t('SNIPPETS_PAGE_NEXTJS_WARNING')} </h1>
                <Radio.Group onChange={handleModeChange} value={nextjsMode}>
                    <Radio.Button value="app-router"> App router</Radio.Button>
                    <Radio.Button value="page-router">Page router</Radio.Button>
                </Radio.Group>
              <div className="code-snippet-container mt-6">
                  {nextjsMode === 'app-router' && (
                    renderAppRouter()
                  )}
                  {nextjsMode === 'page-router' && (
                    renderPageRouter()
                  )}
                </div>
              </TabPane>
            </Tabs>
        </div>
      );
    };
   const PublishersBannerComponent = () => {
     return (
        <div className={`publishers`}>
          <Tabs defaultActiveKey="1" type="card" className="mt-6">
            <TabPane tab="Vanilla JS" key="1">
                <div className="code-snippet">
                  <div className="code-snippet-label mb-2">1. Embedding snippet (Please check General and vanilla tabs for more details)</div>
                </div>
                <div className="code-snippet mt-6">
                  <div className="code-snippet-label mb-2">2. Add tasks container for banner type into the body</div>
                  <div className="code-snippet-code">
                  {srcLink && <CodeSnippet code_string={advertisers.vanilla_js.code_string_adding_1} />}
                  </div>
                </div>
              </TabPane>
              <TabPane tab="React JS" key="2">
                <div className="code-snippet">
                  <div className="code-snippet-label mb-2">1. Embedding snippet (Please check General and reactjs tabs for more details)</div>
                </div>
               <div className="code-snippet mt-6">
                  <div className="code-snippet-label mb-2">2. Add tasks container for banner type into the body</div>
                  <div className="code-snippet-code">
                  {srcLink && <CodeSnippet code_string={advertisers.react_js.code_string_adding_1} />}
                  </div>
                </div>
              </TabPane>
            </Tabs>
        </div>
      )
    }
    const PublishersCheckUserConversion = () => {
      return (
        <div className={`publishers`}>
          <div className="code-snippet">
            <div className="code-snippet-label mb-2">Call API to check user conversion</div>
            <div className="code-snippet-code">
            {apiUrl && <CodeSnippet language="javascript" code_string={advertisers.vanilla_js.code_string_check_user_conversion(apiUrl)} />}
            </div>
          </div>
        </div>
      )
    }
 
    const items: CollapseProps['items'] = [
      {
        key: '1',
        label: t('SNIPPETS_PAGE_LABEL_HANDLING'),
        children:  <PublishersOfferWallComponent/>,
      },
      // {
      //   key: '2',
      //   label: `Display Banner`,
      //   children:  <PublishersBannerComponent/>,
      // },
      // {
      //   key: '3',
      //   label: `Check User Conversion`,
      //   children:  <PublishersCheckUserConversion/>,
      // },
    ];
    return (
      <div className={`${cssClass.spPublisher}`}>
        <div className="main-component-container">
            <Collapse
              defaultActiveKey={['1']}
              items={items}
            />
        </div>
      </div>
    );
  
}

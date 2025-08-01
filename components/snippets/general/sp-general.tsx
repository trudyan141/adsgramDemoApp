"use client";
import { useState, useEffect } from "react";
import CodeSnippet from "../CodeSnippet";
import { sdk_embedding } from "./code_snippet";
import cssClass from "./sp-general.module.scss";
import type { CollapseProps} from 'antd';
import { Collapse, Tabs, Radio} from 'antd';
const { TabPane } = Tabs;
import { BANNER_CODE_URL } from "@/constants/bannerCode";
import { render } from "react-dom";
export default function SpGeneralComponent() {
    /**
     * STATES
     */
    const [activeTab, setActiveTab] = useState<string>('vanilla');
    const [walletHash, setWalletHash] = useState<string | null>(null);
    const [srcLink, setSrcLink] = useState<string | null>(null);
    const [nextjsMode, setNextjsMode] = useState<string | null>('app-router');
  
    /**
     * FUNCTIONS
     */
    const handleActiveTab = (key: string) => {
      setActiveTab(key);
    }
    const handleModeChange = (e: any) => {
      console.log("🚀 ~ handleModeChange ~ e:", e)
      const mode = e.target.value;
      setNextjsMode(mode);
    }
    /**
     * USE EFFECTS
     */
    useEffect(() => {
        let stringStore:any = localStorage?.getItem('sdk_dmtp');
        let sdk_dmtp:any = JSON.parse(stringStore);
        const { wallet_hash } = sdk_dmtp?.auth || {};
        setWalletHash(wallet_hash)
        const src_link = `${BANNER_CODE_URL}?walletAddress=${wallet_hash}`;
        setSrcLink(src_link);
    }, [])
    /**
     * RENDERS
     */
    const renderAppRouter = () => {
      return (
        <>
        <div className="code-snippet">
          <div className="code-snippet-label mb-2">1. Create BecScript for load script and call load tasks from client side  </div>
          <div className="code-snippet-code">
            {srcLink && <CodeSnippet language="typescript" code_string={sdk_embedding.nextjs.appRouter.scriptComponent(srcLink)} />}
          </div>
          <div className="code-snippet mt-6">
            <div className="code-snippet-label mb-2">1'. Report event after onLoad (Optional for publisher script)</div>
            <div className="code-snippet-code">
              <CodeSnippet code_string={sdk_embedding.nextjs.appRouter.report_event} />
            </div>
          </div>
        </div>
        <div className="code-snippet mt-6">
          <div className="code-snippet-label mb-2">2. import becScript in `app/layout.tsx`  </div>
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
          <div className="code-snippet-label mb-2">1. import script in `page/_app.tsx` for load script and call load tasks from client side </div>
          <div className="code-snippet-code">
            {srcLink && <CodeSnippet language="typescript" code_string={sdk_embedding.nextjs.pageRouter.import_script(srcLink)} />}
          </div>
          <div className="code-snippet mt-6">
            <div className="code-snippet-label mb-2">1'. Report event after onLoad (Optional for publisher script)</div>
            <div className="code-snippet-code">
              <CodeSnippet code_string={sdk_embedding.nextjs.pageRouter.report_event} />
            </div>
          </div>
        </div>
        
        </>
      )
    }
    const SDKEmbeddingComponent = () => {
      return (
        <div className={`sdk-embedding`}>
            <Tabs activeKey={activeTab} onChange={handleActiveTab} type="card" className="mt-6">
              <TabPane tab="Vanilla JS" key="vanilla">
                <div className="code-snippet">
                  <div className="code-snippet-label mb-2">1. Add the following code into the head of html page</div>
                  <div className="code-snippet-code">
                  {srcLink && <CodeSnippet code_string={sdk_embedding.vanilla_js.code_string_link(srcLink)} />}
                  </div>
                </div>
                <div className="code-snippet mt-6">
                  <div className="code-snippet-label mb-2">2. Call function `Onload` to load tasks</div>
                  <div className="code-snippet-code">
                  {srcLink && <CodeSnippet  code_string={sdk_embedding.vanilla_js.code_string_adding_2} />}
                  </div>
                </div>
                <div className="code-snippet mt-6">
                  <div className="code-snippet-label mb-2">2'. Report event after onLoad (Optional for publisher script)</div>
                  <div className="code-snippet-code">
                    <CodeSnippet code_string={sdk_embedding.vanilla_js.code_string_report_event} />
                  </div>
                </div>
                <div className="code-snippet mt-6">
                  <div className="code-snippet-label mb-2">3. Example</div>
                  <div className="code-snippet-code">
                  {srcLink && <CodeSnippet code_string={sdk_embedding.vanilla_js.code_string_example(srcLink)} />}
                  </div>
                </div>
              </TabPane>
              <TabPane tab="React JS" key="reactjs">
              <div className="code-snippet">
                  <div className="code-snippet-label mb-2">1.Add the following code into the head of html page</div>
                  <div className="code-snippet-code">
                  {srcLink && <CodeSnippet code_string={sdk_embedding.react_js.code_string_link(srcLink)} />}
                  </div>
              </div>
              <div className="code-snippet mt-6">
                  <div className="code-snippet-label mb-2">2. Call function `Onload` to load tasks</div>
                  <div className="code-snippet-code">
                  {srcLink && <CodeSnippet code_string={sdk_embedding.react_js.code_string_adding_2} />}
                  </div>
                </div>
                <div className="code-snippet mt-6">
                  <div className="code-snippet-label mb-2">2'. Report event after onLoad (Optional for publisher script)</div>
                  <div className="code-snippet-code">
                    <CodeSnippet code_string={sdk_embedding.react_js.code_string_report_event} />
                  </div>
                </div>
                <div className="code-snippet mt-6">
                  <div className="code-snippet-label mb-2">2. Example</div>
                  <div className="code-snippet-code">
                  {srcLink && <CodeSnippet code_string={sdk_embedding.react_js.code_string_example(srcLink)} />}
                  </div>
                </div>
              </TabPane>
              <TabPane tab="Nextjs" key="nextj">
                <h1 className="text-base text-warning font-bold mb-4">Warning: for SSR projects (nextjs, nuxtjs....) make sure we load and run script from client side. </h1>
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
    const items: CollapseProps['items'] = [
      {
        key: '1',
        label: `SDK Embedding`,
        children:  <SDKEmbeddingComponent/>,
      },
    ];
    return (
      <div className={`${cssClass.spGeneral}`}>
        <div className="main-component-container">
            <Collapse
              defaultActiveKey={['1']}
              items={items}
            />
        </div>
      </div>
    );
  
}

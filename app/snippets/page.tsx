"use client";

import cssClass from "./page.module.scss";
import { Tabs } from 'antd';
const { TabPane } = Tabs;
import SpGeneralComponent from "@/components/snippets/general/sp-general";
import SpPublishersComponent from "@/components/snippets/publishers/sp-publishers";
import SpAdvertisersComponent from "@/components/snippets/advertisers/sp-advertisers";
import { useTranslations } from 'next-intl';
export default function SnippetsPage() {
    const t = useTranslations();
    /**
     * USE EFFECTS
     */

    /**
     * RENDERS
     */
    return (
      <div className={`flex min-h-screen flex-col items-center xl:p-24 xs:p-4 ${cssClass.SnippetsPage}`}>
        <h1 className="text-2xl font-bold pt-4">{t('SNIPPETS_PAGE_TITLE')}</h1>
        <div className="main-page-container  mb-4">
            <Tabs> 
                {/* <TabPane tab="General" key='general'>
                  <SpGeneralComponent/>
                </TabPane> */}
                <TabPane tab={t('SNIPPETS_PAGE_TABS_PUBLISHERS')} key='publishers'>
                <SpPublishersComponent />
                </TabPane>
                <TabPane tab={t('SNIPPETS_PAGE_TABS_ADVERTISERS')} key='advertisers'>
                  <SpAdvertisersComponent/>
                </TabPane>
              </Tabs>
        </div>
      </div>
    );
  
}

"use client";

import { useCallback, useContext, useEffect, useState, useRef } from "react";
import backendService from "@/services/backend/backend.service";
import cssClass from "./banner-preview.module.scss";
import { LeftCircleOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import {truncateStringToRowsWithFont} from "@/utils/common";
type Props = {
  form: any;
  imgUrl: string
};
export default function CodeBlock({ form, imgUrl }: Props) {
 
  /**
   * STATES
   * */
  const [rewardInfo, setRewardInfo] = useState('');
  const [isDetail, setIsDetail] = useState(false);
  const [contentWidth, setContentWidth] = useState(200);
  const [isMounted, setIsMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  /**
   * HOOKS
   */
  const t = useTranslations();
  /**
   * FUNCTIONS
   */
  const getInventories = async () => {
    const rs = await backendService.getInventories();
    if (rs.items?.length > 0) {
      setRewardInfo(rs.items[0].reward_info);
    } else { 
      setRewardInfo('Play');
    }
  }
  const initData = async () => {
    getInventories();
  }
  const openDetail = (event: any) => {
    setIsDetail(true);
  }
  const handleLinkClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const truncateText = (text: string, rows: number, width: number, fontSize?: number, fontWeight?: string) => {
    if (!isMounted) return text;
    return truncateStringToRowsWithFont(text, rows, width, undefined, fontSize, fontWeight);
  };

  /**
   * USE EFFECTS
   */
   useEffect(() => {
     initData();
   },[])

   useEffect(() => {
    // Cleanup previous observer if it exists
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    // Create a new ResizeObserver instance
    resizeObserverRef.current = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContentWidth(entry.contentRect.width);
      }
    });

    // Get the current banner-content element using ref
    const currentContent = contentRef.current;
    if (currentContent) {
      resizeObserverRef.current.observe(currentContent);
    }

    // Cleanup observer on component unmount or when isDetail changes
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [isDetail]); // Re-run when isDetail changes

    /**
     * RENDERS
     */
  const renderContent = () => {
    if(isDetail) {
       return (
        <div className="detail-info">
           <div className="banner-link">
            <img className="banner-image" src={imgUrl || `/images/placeholder.png`} alt={form?.altText || 'Lorem ipsum'} />
            <div className="banner-content-right"> 
              <div className="banner-content" ref={contentRef}> 
                <div className="banner-link-title">{truncateText(form?.altText, 1, contentWidth, 16, 'bold') || 'Lorem ipsum'}</div>
              </div>
              <a  href={form?.targetUrl} target="_blank" onClick={handleLinkClick}><div className="banner-link-btn">{rewardInfo || 'Lorem ipsum'} </div> </a>
            </div>
          </div>
          <div className="description mt-4">
            <div className="title">{t('ADS_CREATE_PAGE_CARD_FORM_LABEL_DESCRIPTION')}</div>
            <div className="content break-all">{form?.description || 'Lorem ipsum'}</div>
          </div>
          <div className="description mt-4">
            <div className="title">{t('ADS_PAGE_TABLE_LABEL_REWARD_CTA')}</div>
            <div className="content break-all">{form?.rewardDesc || 'Lorem ipsum'}</div>
          </div>
        </div>
       )
    }else{
      return (
      <div className="banner-link cursor-pointer" onClick={openDetail}>
            <img className="banner-image" src={imgUrl || `/images/placeholder.png`} alt={form?.altText || 'Lorem ipsum'} />
            <div className="banner-content-right"> 
              <div className="banner-content" ref={contentRef}> 
                <div className="banner-link-title">{truncateText(form?.altText, 1, contentWidth, 16, 'bold') || 'Lorem ipsum'}</div>
                <div className="banner-link-description">{truncateText(form?.description, 2, contentWidth, 13, 'normal') || 'Lorem ipsum'} </div>
              </div>
              <a  href={form?.targetUrl} target="_blank" onClick={handleLinkClick}>
                <div className="banner-link-btn">{rewardInfo || 'Play'} </div>
              </a>
            </div>
        </div>
      )
    }
  }
  return (
    <div className={`${cssClass.bannerPreview}`}>
        {isDetail && 
        <div className="back-status"> 
            <div className="back-icon" onClick={() => setIsDetail(false)}>
            <LeftCircleOutlined />
            </div>
          </div>
        }
        <div className={`banner-container`}>
          { renderContent()} 
        </div>
      </div>
    );
  
}

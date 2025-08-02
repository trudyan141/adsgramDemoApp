"use client";
import BannerComponent from "@/components/homePage/banner/banner.component";
import { pageContent } from '@/constants/landing';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS CSS
import Head from 'next/head'; // Import the Head component
import { useEffect } from "react";
import cssClass from "./page.module.scss";
import Link from 'next/link';
export default function Home() {
  /**
   * STATES
   * */
    
 
  /***
   * HOOKS
   */
    /**
   * FUNCTIONS
   */
 
   
/***
   * USE EFFECTS
   */
  // animation on scroll config
  useEffect(() => {
    AOS.init({
      // Global settings:
      disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
      startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
      initClassName: 'aos-init', // class applied after initialization
      animatedClassName: 'aos-animate', // class applied on animation
      useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
      disableMutationObserver: false, // disables automatic mutations' detections (advanced)
      debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
      throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

      // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
      offset: 120, // offset (in px) from the original trigger point
      delay: 0, // values from 0 to 3000, with step 50ms
      duration: 400, // values from 0 to 3000, with step 50ms
      easing: 'ease', // default easing for AOS animations
      once: false, // whether animation should happen only once - while scrolling down
      mirror: false, // whether elements should animate out while scrolling past them
      anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
    });
  }, []);

 
  /**
   * RENDERS
   */
  return (
    <>
      <Head>
        <title>{pageContent.title} | SDK App </title> 
        <meta name="description" content={pageContent.hero.subtitle} />
      </Head>
    <main className={`flex min-h-screen flex-col items-center justify-between ${cssClass.homePage}`} >
        <div className="home-container"> 
          <section className="home-title">
          <Link className="text-blue-500 mb-2 mr-2" href="/example-adsgram">Example Adsgram</Link>
          <Link className="text-blue-500 mb-2 mr-2" href="/example-task">Example Task</Link>
          <div className="home-bg-header-mask"></div>
          <div className="home-title-content">
            <BannerComponent />
          </div>
      </section>
      </div>
      </main>
    </>
  );
}

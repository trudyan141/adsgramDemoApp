export const sdk_embedding = {
    vanilla_js: {
        code_string_link: (src_link) => `<script src="${src_link}"></script>`,
        code_string_adding_1: `<div id="exchangeBanner"></div>`,
        code_string_adding_2:`<script>
  if (TE && typeof TE.onLoad === 'function') {
      TE.onLoad()
  } else {
      console.error('onLoad is not a function');
  }
</script>`,
        code_string_report_event: `<script>
// Call reportEvent after onLoad completed (Optional for publisher script)
if (TE && typeof TE.reportEvent === 'function') {
    TE.reportEvent({
        action: 'CLICK', // OR 'PLAY'
        // click_id  // OPTIONAL
    });
}
</script>`,
        code_string_example:(src_link) => `<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="${src_link}" ></script>
    <style> 
        h1{
            text-align: center;
        }
        #exchangeBanner{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #openOfferWallButton{
            margin-top: 120px;
            margin-left: 120px;
        }
    </style>
</head>
<body>
    <h1>DEMO BANNER EXCHANGE CODE</h1>
    <div class="main-content"> 
    
    </div>
     <script>
        document.addEventListener('DOMContentLoaded',async function() {
            // call init TE
            if (TE && typeof TE.onLoad === 'function') {
                await TE.onLoad()
            } else {
                console.error('onLoad is not a function');
            }
        });
    </script>
</body>
</html>
`
  },
    react_js: {
        code_string_link: (src_link) => `<script src="${src_link}"></script>`,
        code_string_adding_1: `<div id="exchangeBanner"></div>`,
        code_string_adding_2:`<script>
  useEffect(() => {
    const initTE = async () => {
        if (TE && typeof TE.onLoad === 'function') {
            await TE.onLoad()
        } else {
            console.error('initTE is not a function');
        }
    };
    
    initTE();
  }, []);
</script>`,
        code_string_report_event: `<script>
// Call reportEvent after onLoad completed (Optional for publisher script)
useEffect(() => {
  if (TE && typeof TE.reportEvent === 'function') {
      TE.reportEvent({
          action: 'CLICK', // OR 'PLAY'
          // click_id  // OPTIONAL
      });
  }
}, []);
</script>`,
        code_string_example:(src_link) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snippets - Reactjs Demo</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js"></script>
    <script src="${src_link}" ></script>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;
        const LandingPage = () => {
            useEffect(() => {
                const initTE = async () => {
                    if (TE && typeof TE.onLoad === 'function') {
                        await TE.onLoad()
                    } else {
                        console.error('initTE is not a function');
                    }
                };
                
                initTE();
            }, []);
            return (
                <div className="min-h-screen flex flex-col">
                  
                </div>
            );
        };
        ReactDOM.render(<LandingPage />, document.getElementById('root'));
    </script>
</body>
</html>

`
    },
    nextjs: {
        appRouter: {
            scriptComponent: (src_link) => `'use client';
import Script from "next/script";
declare const TE;
export default function BecScript({

}) {
  return (
     <Script
        src="${src_link}"
        strategy="afterInteractive" // Loads the script after the page is interactive
        onLoad={async () => {
          if (typeof TE.onLoad === "function") {
            await TE.onLoad();
          } else {
            console.error('TE.onLoad is not a function');
          }
        }}
      />
  );

}
`,
            import_script: `
import BecScript from '@/components/becScript';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <BecScript />
      </body>
    </html>
  );
}
`,
            report_event: `// In your component where you want to report events
useEffect(() => {
  if (typeof window !== 'undefined' && window.TE && typeof window.TE.reportEvent === 'function') {
      window.TE.reportEvent({
          action: 'CLICK', // OR 'PLAY'
          // click_id  // OPTIONAL
      });
  }
}, []);`
        },
        pageRouter: {
            import_script: (src_link) => `import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
declare const TE;
export default function App({ Component, pageProps }: AppProps) {
  return <>
       <Script
        src="${src_link}"
        strategy="afterInteractive" // Loads the script after the page is interactive
        onLoad={async () => {
          if (typeof TE.onLoad === "function") {
              await TE.onLoad();
          } else {
            console.error('TE.onLoad is not a function');
          }
        }}
      />
     <Component {...pageProps} />;
  </>
 
}
`,
            report_event: `// In your component where you want to report events
useEffect(() => {
  if (typeof window !== 'undefined' && window.TE && typeof window.TE.reportEvent === 'function') {
      window.TE.reportEvent({
          action: 'CLICK', // OR 'PLAY'
          // click_id  // OPTIONAL
      });
  }
}, []);`
        }
    }
}
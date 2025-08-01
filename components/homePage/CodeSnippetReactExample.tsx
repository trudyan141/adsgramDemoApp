
import CodeBlock from "@/components/codeBlock/CodeBlock";
import {
    a11yDark
} from "react-syntax-highlighter/dist/cjs/styles/hljs";
const CodeSnippetReactExample = ({url,walletAddress,  ...props } : any) => {
    const src_link = `${url}?walletAddress=${walletAddress}`;  
    const code_string = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyProduct - Product Description</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;
        const LandingPage = () => {
            useEffect(() => {
                const script = document.createElement('script');
                script.src = "${src_link}";
                script.async = true;
                document.body.appendChild(script);
                return () => {
                document.body.removeChild(script);
                };
            }, []);
            return (
                <div className="min-h-screen flex flex-col">
                    <div id="exchangeBanner"></div> 
                    <button id="openOfferWallButton" onClick={() =>{
                        if (TE && typeof TE.offerWall === 'function') {
                            TE.offerWall();
                        } else {
                            console.error('TE is not defined or offerWall is not a function');
                        }
                    }}>Open Offer Wall</button>
                </div>
            );
        };

        ReactDOM.render(<LandingPage />, document.getElementById('root'));
    </script>
</body>
</html>`;
  return (
    <>
      <CodeBlock language="html" code={code_string} style={a11yDark} />

    </>

    )
 }

export default CodeSnippetReactExample

import CodeBlock from "@/components/codeBlock/CodeBlock";
import {
    a11yDark
} from "react-syntax-highlighter/dist/cjs/styles/hljs";
const CodeSnippetExample = ({url,walletAddress,  ...props } : any) => {
    const src_link = `${url}?walletAddress=${walletAddress}`;  
  const code_string = `<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="${src_link}"></script>
    <style> 
        h1{
            text-align: center;
        }
        #exchangeBanner{
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
</head>
<body>
    <h1>DEMO BANNER EXCHANGE CODE</h1>
    <div id="exchangeBanner"></div> 

    <!--example to open offer wall -->
    <button id="openOfferWallButton">Open Offer Wall</button>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const openOfferWallButton = document.getElementById('openOfferWallButton');
            openOfferWallButton.addEventListener('click', function() {
                if (TE && typeof TE.offerWall === 'function') {
                    TE.offerWall();
                } else {
                    console.error('TE is not defined or offerWall is not a function');
                }
            });
           
        });
    </script>
</body>
</html>`;
  return (
    <>
      <CodeBlock language="html" code={code_string} style={a11yDark} />

    </>

    )
 }

export default CodeSnippetExample
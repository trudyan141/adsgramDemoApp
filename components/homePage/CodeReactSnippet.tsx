

import CodeBlock from "@/components/codeBlock/CodeBlock";
import {
  a11yDark
} from "react-syntax-highlighter/dist/cjs/styles/hljs";
const CodeReactSnippet = ({ url, walletAddress, ...props }: any) => {
  const src_link = `${url}?walletAddress=${walletAddress}`;  
  const code_string = ` useEffect(() => {
  const script = document.createElement('script');
  script.src = "${src_link}";
  script.async = true;
  document.body.appendChild(script);
  
  return () => {
  document.body.removeChild(script);
  };
}, []);`;
  return (
    <>
      <CodeBlock language="html" code={code_string} style={a11yDark} />
    </>

    )
 }

export default CodeReactSnippet
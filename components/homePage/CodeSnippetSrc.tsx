
import CodeBlock from "@/components/codeBlock/CodeBlock";
import {
  a11yDark
} from "react-syntax-highlighter/dist/cjs/styles/hljs";
const CodeSnippetSrc = ({ url, walletAddress, ...props } : any) => {
    const src_link = `${url}?walletAddress=${walletAddress}`;
    
  const code_string = `<script src="${src_link}"></script>`;
  return (
    <>
      <CodeBlock language="html" code={code_string} style={a11yDark} />
 
    </>

    )
 }

export default CodeSnippetSrc
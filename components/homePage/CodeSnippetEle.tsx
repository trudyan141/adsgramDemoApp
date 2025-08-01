
import CodeBlock from "@/components/codeBlock/CodeBlock";
import {
  a11yDark
} from "react-syntax-highlighter/dist/cjs/styles/hljs";
const CodeSnippetEle = ({ ...props } : any) => {
    
  const code_string = `<div id="exchangeBanner"></div> `;
  return (
    <>
      <CodeBlock language="html" code={code_string} style={a11yDark} />
 
    </>

    )
 }

export default CodeSnippetEle
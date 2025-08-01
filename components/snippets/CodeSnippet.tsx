
import CodeBlock from "@/components/codeBlock/CodeBlock";
import {
  a11yDark
} from "react-syntax-highlighter/dist/cjs/styles/hljs";
const CodeSnippet = ({ code_string, language = "htmlbars",...props } : any) => {
  return (
    <>
      <CodeBlock language={language} code={code_string} style={a11yDark} />
    </>
    )
}
export default CodeSnippet
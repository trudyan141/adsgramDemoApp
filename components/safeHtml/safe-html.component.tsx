'use client';
import { useEffect, useState } from 'react';
import createDOMPurify from 'dompurify';

export default function SafeHtmlComponent({ htmlContent }: { htmlContent: string }) {
  const [sanitizedHtml, setSanitizedHtml] = useState<string | null>(null);

  useEffect(() => {
    const DOMPurify = createDOMPurify(window);
    setSanitizedHtml(DOMPurify.sanitize(htmlContent));
  }, [htmlContent]);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml || '' }} />
}
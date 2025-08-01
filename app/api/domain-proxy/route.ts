import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

const extractMetadata = (html: string) => {
  const decodeHtml = (text: string) => {
    const entities: { [key: string]: string } = {
      '&#39;': "'",
      '&#33;': "!",
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"'
    };
    return text.replace(/&[#\w]+;/g, match => entities[match] || match);
  };

  const getMetaContent = (pattern: RegExp) => {
    const match = html.match(pattern);
    return match ? decodeHtml(match[1]) : '';
  };

  const title = getMetaContent(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/) || 
                getMetaContent(/<title[^>]*>([^<]+)<\/title>/) ||
                getMetaContent(/<meta[^>]*name="twitter:title"[^>]*content="([^"]+)"/);

  const description = getMetaContent(/<meta[^>]*name="description"[^>]*content="([^"]+)"/) ||
                     getMetaContent(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/) ||
                     getMetaContent(/<meta[^>]*name="twitter:description"[^>]*content="([^"]+)"/);

  const image = getMetaContent(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/) ||
                getMetaContent(/<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"/);

  const favicon = getMetaContent(/<link[^>]*rel="icon"[^>]*href="([^"]+)"/) ||
                 getMetaContent(/<link[^>]*rel="shortcut icon"[^>]*href="([^"]+)"/);

  return { title, description, image, favicon };
};

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url).searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'MESSAGE_URL_REQUIRED' }, { status: 400 });
    }

    // Validate URL format
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return NextResponse.json({ error: 'MESSAGE_INVALID_URL_PROTOCOL' }, { status: 400 });
      }
    } catch (urlError) {
      return NextResponse.json({ error: 'MESSAGE_INVALID_URL' }, { status: 400 });
    }

    console.log("🚀 ~ GET ~ url:", url);
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error('MESSAGE_FAIL_TO_FETCH_URL');
      }

      const html = await response.text();
      const metadata = extractMetadata(html);

      return NextResponse.json({
        title: metadata.title || '',
        description: metadata.description || '',
        image: metadata.image || '',
        url: url,
        favicon: metadata.favicon || ''
      });
    } catch (metadataError) {
      console.error('Error fetching metadata:', metadataError);
      // Fallback response with minimal data
      return NextResponse.json({
        title: '',
        description: '',
        image: '',
        url: url,
        favicon: ''
      });
    }
  } catch (error) {
    console.error('Error in domain-proxy:', error);
    return NextResponse.json({ error: 'MESSAGE_FAIL_TO_FETCH_URL' }, { status: 500 });
  }
}

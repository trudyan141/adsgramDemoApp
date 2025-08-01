import axios from 'axios';
import backendService from './backend/backend.service';
import http from '@/services/backend/http';
class DomainService {
  async getDomainInfo(url: string): Promise<any> {
    try {
      // Clean up URL if needed
      const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // Use our proxy endpoint
      const response = await axios.get('/api/domain-proxy', {
        params: {
          url: cleanUrl
        }
      });

      if (response.data) {
        return {
          title: response.data.title,
          description: response.data.description,
          image: response.data.image,
          url: response.data.url,
          favicon: response.data.favicon
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching getDomainInfo:', error);
      return null;
    }
  }
  async resizeImageFromUrl(url: string, width?  : number, height?: number, isResize?: boolean): Promise<any> {
    try {
      // Clean up URL if needed
      const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
      const auth = localStorage.getItem('sdk_dmtp');
      const authToken = auth ? JSON.parse(auth).auth.access_token : null;
      const proxyUrl = '/api/resize-image-url-proxy';
      const params = {
        url: cleanUrl,
        width: width,
        height: height,
        isResize: isResize
      };
      // Use our proxy endpoint
      const response = await axios.get(proxyUrl, {
        params,
        headers: {
          'Authorization': `Bearer ${authToken}` // Include the token in the request headers
        }
      });

      if (response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching resizeImageFromUrl:', error);
      return null;
    }
  }
}

export const domainService = new DomainService();
export default domainService;

import BigNumber from "bignumber.js";
import { TON_DECIMALS } from "../constants/tonConfigs";


export const toCurrency = (number, decimals = 2) => {
    if (isNaN(number)) {
        return 'Invalid number';
    }

    // Split the number into integer and decimal parts
    const parts = number.toString().split('.');

    // Format the integer part with commas
    parts[0] = parseInt(parts[0], 10).toLocaleString();

    // Handle the decimal part
    if (parts[1] && decimals > 0) {
        parts[1] = parts[1].slice(0, decimals); // Trim to the desired number of decimals
        return `${parts[0]}.${parts[1]}`;
    }

    return parts[0];
}
export const showTonBalance = (balance) => { 
    if(!balance){
      return 0;
    }
    return `${toCurrency(balance / Math.pow(10, TON_DECIMALS))}`;
}
export const toWei = (amount) => { 
   if(!amount){
        return 0;
    }
    return BigNumber(amount).times(Math.pow(10, TON_DECIMALS)).toFixed(0);
}
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const errorMessage = (error) => {
    const message = error?.response?.data?.message
    || error?.data?.message 
    || error?.message
    || error.toString();
    return message
}

export const truncateStringToRowsWithFont = (
    input,
    n,
    rowWidth,
    fontFamily = "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
    fontSize = 16,
    fontWeight = "normal"
  ) => {
    // Return original string if we're not in a browser environment
    if (typeof window === 'undefined') {
      return input;
    }

    if (!input) return '';
    
    if (n <= 0 || rowWidth <= 0) {
        throw new Error("Invalid number of rows or rowWidth.");
    }
  
    // Create a canvas context for measuring text
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
  
    // Set the font property
    const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    context.font = font;
  
    // Calculate width of "... more"
    const moreText = "... more";
    const moreWidth = context.measureText(moreText).width;
  
    // For single line truncation
    if (n === 1) {
        // If text fits completely, return it
        if (context.measureText(input).width <= rowWidth) {
            return input;
        }
  
        // Binary search to find maximum text that fits with "... more"
        let low = 0;
        let high = input.length;
        let best = "";
  
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const testText = input.slice(0, mid);
            const testWidth = context.measureText(testText).width + moreWidth;
  
            if (testWidth <= rowWidth) {
                best = testText;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
  
        // Find last space to avoid cutting words
        const lastSpaceIndex = best.lastIndexOf(" ");
        if (lastSpaceIndex !== -1) {
            best = best.substring(0, lastSpaceIndex);
        }
  
        return best + moreText;
    }
  
    // For multi-line truncation
    const tempDiv = document.createElement('div');
    tempDiv.style.cssText = `
        position: absolute;
        visibility: hidden;
        width: ${rowWidth}px;
        font-size: ${fontSize}px;
        line-height: 1.2em;
        word-break: break-word;
    `;
    tempDiv.textContent = input;
    document.body.appendChild(tempDiv);
  
    const lineHeight = fontSize * 1.2; // 1.2em line height
    const maxHeight = n * lineHeight;
  
    if (tempDiv.offsetHeight <= maxHeight) {
        document.body.removeChild(tempDiv);
        return input;
    }
  
    // Binary search to find maximum text that fits in n lines
    let low = 0;
    let high = input.length;
    let best = "";
  
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const testText = input.slice(0, mid);
        tempDiv.textContent = testText + moreText;
  
        if (tempDiv.offsetHeight <= maxHeight) {
            best = testText;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
  
    document.body.removeChild(tempDiv);
  
    // Find last space to avoid cutting words
    const lastSpaceIndex = best.lastIndexOf(" ");
    if (lastSpaceIndex !== -1) {
        best = best.substring(0, lastSpaceIndex);
    }
  
    return best + moreText;
}

export const formatChartDate = (date) => {
    if (date.length === 12) { // YYYYMMddHH format
      return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)} ${date.slice(8, 10)}:${date.slice(10, 12)}`;
    } else if (date.length === 10) { // YYYYMMddHH format
      return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)} ${date.slice(8, 10)}:00`;
    } else if (date.length === 8) { // YYYYMMDD format
      return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`;
    } else if (date.length === 6) { // YYYYMM format
      return `${date.slice(0, 4)}-${date.slice(4, 6)}`;
    }
    return date; // return as is if format is unknown
};
  
  // Debounce function to delay API calls
  export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
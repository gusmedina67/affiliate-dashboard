const CONFIG = {
    // API Base URLs
    AMAZON_API_BASE_URL: process.env.REACT_APP_AMAZON_API_BASE_URL || "https://qzp5zc7bhi.execute-api.us-west-1.amazonaws.com/stg",
    COMMERCE7_API_BASE_URL: process.env.REACT_APP_COMMERCE7_API_BASE_URL || "https://api.commerce7.com/v1",
  
    // API Credentials (Stored in Environment Variables)
    AMAZON_API_USERNAME: process.env.REACT_APP_AMAZON_API_USERNAME,
    AMAZON_API_PASSWORD: process.env.REACT_APP_AMAZON_API_PASSWORD,
  
    COMMERCE7_API_USERNAME: process.env.REACT_APP_COMMERCE7_API_USERNAME,
    COMMERCE7_API_PASSWORD: process.env.REACT_APP_COMMERCE7_API_PASSWORD,
  };
  
  export default CONFIG;
  
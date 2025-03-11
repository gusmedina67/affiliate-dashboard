import axios from "axios";
import CONFIG from "../config";

// Function to construct API URLs dynamically
export function getApiUrl(service, endpoint) {
  let baseUrl;

  switch (service) {
    case "amazon":
      baseUrl = CONFIG.AMAZON_API_BASE_URL;
      break;
    case "commerce7":
      baseUrl = CONFIG.COMMERCE7_API_BASE_URL;
      break;
    default:
      throw new Error("Invalid API service");
  }

  return `${baseUrl}/${endpoint}`;
}

// Function to generate Basic Auth Header
function getAuthHeaders(service) {
  let username, password;

  switch (service) {
    case "amazon":
      username = CONFIG.AMAZON_API_USERNAME;
      password = CONFIG.AMAZON_API_PASSWORD;
      break;
    case "commerce7":
      username = CONFIG.COMMERCE7_API_USERNAME;
      password = CONFIG.COMMERCE7_API_PASSWORD;
      break;
    default:
      throw new Error("Invalid API service");
  }

  const basicAuth = btoa(`${username}:${password}`); // Encode to Base64
  return {
    "Authorization": `Basic ${basicAuth}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
}

// ✅ Function to Make API Requests with Axios
//export async function fetchData(service, endpoint, method = "GET", body = null) {
export async function fetchData(service, endpoint, method = "GET", body = null, customHeaders = {}) {
  const url = getApiUrl(service, endpoint);
  //const headers = getAuthHeaders(service);
  const headers = {
    ...getAuthHeaders(service), // ✅ Add authentication headers
    ...customHeaders,           // ✅ Add any extra headers passed
  };

  console.log("[Axios] Sending Request:", { url, headers });

  try {
    const response = await axios({
      url,
      method,
      headers,
      data: body ? JSON.stringify(body) : null
      //withCredentials: true, // Ensures cookies/authentication are included
    });

    console.log("[Axios] Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("[Axios] API Request Failed:", error);
    throw error;
  }
}


// import CONFIG from "../config";

// // Function to construct API URLs dynamically
// export function getApiUrl(service, endpoint) {
//   let baseUrl;

//   switch (service) {
//     case "amazon":
//       baseUrl = CONFIG.AMAZON_API_BASE_URL;
//       break;
//     case "commerce7":
//       baseUrl = CONFIG.COMMERCE7_API_BASE_URL;
//       break;
//     default:
//       throw new Error("Invalid API service");
//   }

//   return `${baseUrl}/${endpoint}`;
// }

// // Function to generate Basic Auth Header
// function getAuthHeaders(service) {
//   let username, password;

//   switch (service) {
//     case "amazon":
//       username = CONFIG.AMAZON_API_USERNAME;
//       password = CONFIG.AMAZON_API_PASSWORD;
//       break;
//     case "commerce7":
//       username = CONFIG.COMMERCE7_API_USERNAME;
//       password = CONFIG.COMMERCE7_API_PASSWORD;
//       break;
//     default:
//       throw new Error("Invalid API service");
//   }

//   const basicAuth = btoa(`${username}:${password}`); // Encode to Base64
//   return {
//     "Authorization": `Basic ${basicAuth}`,
//     "Content-Type": "application/json",
//     "Accept": "application/json",
//     "Origin": window.location.origin, // ✅ Explicitly set Origin
//   };
// }

// export async function fetchData(service, endpoint, method = "GET", body = null) {
//     const url = getApiUrl(service, endpoint);
//     const headers = getAuthHeaders(service);
  
//     const options = {
//       method,
//       headers: {
//         ...headers,
//         "Accept": "application/json", // Ensures response is JSON
//       },
//       mode: "cors", // Explicitly enable CORS
//       cache: "no-cache",
//       credentials: "include",
//       body: body ? JSON.stringify(body) : null,
//     };
  
//     console.log("[React fetchData] Sending request:", { url, options });
  
//     try {
//       // ✅ Explicitly perform preflight OPTIONS request before actual request
//       if (method !== "OPTIONS") {
//         await fetch(url, {
//           method: "OPTIONS",
//           headers: {
//             "Access-Control-Request-Method": method,
//             "Access-Control-Request-Headers": "Authorization, Content-Type",
//             ...headers,
//           },
//           mode: "cors",
//         });
//       }
  
//       // ✅ Now perform the actual GET/POST request
//       const response = await fetch(url, options);
//       console.log("[React fetchData] Response Headers:", response.headers);
  
//       if (!response.ok) {
//         throw new Error(`API Error (${service}): ${response.status} ${response.statusText}`);
//       }
  
//       const data = await response.json();
//       console.log("[React fetchData] Response Data:", data);
//       return data;
//     } catch (error) {
//       console.error("[React fetchData] API Request Failed:", error);
//       throw error;
//     }
//   }
  
  
  

// // Function to make API requests
// export async function fetchData(service, endpoint, method = "GET", body = null) {
//   const url = getApiUrl(service, endpoint);
//   const headers = getAuthHeaders(service);

//   const options = {
//     method,
//     headers,
//     mode: "cors", // ✅ Ensures CORS is explicitly handled
//     credentials: "include", // ✅ Ensures cookies and auth headers are sent
//     body: body ? JSON.stringify(body) : null,
//   };

//   try {
//     const response = await fetch(url, options);

//     // Explicitly handle CORS-related errors
//     if (response.status === 403 || response.status === 401) {
//       throw new Error(`CORS/Authentication Error: ${response.statusText}`);
//     }
    
//     if (!response.ok) {
//       throw new Error(`API Error (${service}): ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("API Request Failed:", error);
//     throw error;
//   }
// }



// import CONFIG from "../config";

// // Function to construct API URLs dynamically
// export function getApiUrl(service, endpoint) {
//   let baseUrl;

//   switch (service) {
//     case "amazon":
//       baseUrl = CONFIG.AMAZON_API_BASE_URL;
//       break;
//     case "commerce7":
//       baseUrl = CONFIG.COMMERCE7_API_BASE_URL;
//       break;
//     default:
//       throw new Error("Invalid API service");
//   }

//   return `${baseUrl}/${endpoint}`;
// }

// // Function to generate Basic Auth Header
// function getAuthHeaders(service) {
//   let username, password;

//   switch (service) {
//     case "amazon":
//       username = CONFIG.AMAZON_API_USERNAME;
//       password = CONFIG.AMAZON_API_PASSWORD;
//       break;
//     case "commerce7":
//       username = CONFIG.COMMERCE7_API_USERNAME;
//       password = CONFIG.COMMERCE7_API_PASSWORD;
//       break;
//     default:
//       throw new Error("Invalid API service");
//   }

//   const basicAuth = btoa(`${username}:${password}`); // Encode to Base64
//   return {
//     "Authorization": `Basic ${basicAuth}`,
//     "Content-Type": "application/json",
//   };
// }

// // Function to make API requests
// export async function fetchData(service, endpoint, method = "GET", body = null) {
//   const url = getApiUrl(service, endpoint);
//   const headers = getAuthHeaders(service);

//   const options = {
//     method,
//     headers,
//     body: body ? JSON.stringify(body) : null,
//   };

//   try {
//     const response = await fetch(url, options);
//     if (!response.ok) {
//       throw new Error(`API Error (${service}): ${response.statusText}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("API Request Failed:", error);
//     throw error;
//   }
// }

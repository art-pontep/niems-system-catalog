/**
 * Google Apps Script Secure Backend + CRUD API
 * Author: pontep presha
 * Version: 1.0
 * Last Updated: October 2025 
 */

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                               */
/* -------------------------------------------------------------------------- */

const CONFIG = {
  // 🔧 REQUIRED: Update these values
  SHEET_ID: "<YOUR_SPREADSHEET_ID>", // ✅ Replace with your actual Spreadsheet ID
  CLIENT_ID: "<YOUR_CLIENT_ID>.apps.googleusercontent.com", // ✅ Replace with your actual Client ID
  
  // 🛡️ SECURITY: Authorized users and origins
  ALLOWED_USERS: [
    "your-email@example.com"
  ],
  ALLOWED_ORIGINS: [
    "http://localhost:8000",
    "https://your-username.github.io"
  ],
  
  // 📊 RATE LIMITING & PERFORMANCE
  MAX_REQUESTS_PER_MINUTE: 30,
  MAX_REQUESTS_PER_HOUR: 500,
  CACHE_DURATION: 300, // 5 minutes in seconds
  
  // 🛡️ RATE LIMITING CONFIGURATION
  RATE_LIMIT: {
    MAX_REQUESTS: 30,         // Max requests per window
    WINDOW_MS: 60000,         // 1 minute window in milliseconds
    ENABLED: true             // Enable/disable rate limiting
  },
  
  // 🔍 DEBUGGING & LOGGING
  DEBUG_MODE: true,
  LOG_REQUESTS: true,
  LOG_ERRORS: true,
  LOG_AUTH_EVENTS: true,
  
  // 📋 API SETTINGS
  API_VERSION: "1.0",
  MAX_PAYLOAD_SIZE: 1024 * 1024, // 1MB
  REQUIRED_SHEETS: ["systems", "documents", "requirements"],
  
  // 🔒 SECURITY HEADERS
  SECURITY_HEADERS: {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  }
};

/* -------------------------------------------------------------------------- */
/*                                 ENTRY POINTS                                */
/* -------------------------------------------------------------------------- */

/**
 * 🚀 Health Check Endpoint
 * GET /health - Returns system status and basic info
 */
function healthCheck() {
  try {
    const startTime = Date.now();
    
    // Test database connection
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheetNames = ss.getSheets().map(sheet => sheet.getName());
    
    // Check required sheets
    const missingSheets = CONFIG.REQUIRED_SHEETS.filter(name => !sheetNames.includes(name));
    
    const health = {
      status: missingSheets.length === 0 ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      version: CONFIG.API_VERSION,
      uptime: Date.now() - startTime,
      database: {
        connected: true,
        sheets: sheetNames,
        missingSheets: missingSheets
      },
      security: {
        authRequired: true,
        rateLimiting: true,
        allowedOrigins: CONFIG.ALLOWED_ORIGINS.length
      },
      performance: {
        cacheEnabled: true,
        maxPayloadSize: CONFIG.MAX_PAYLOAD_SIZE
      }
    };
    
    return corsResponse(health);
  } catch (error) {
    console.error("Health check failed:", error);
    return corsResponse({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
}

/**
 * 📥 Handle POST requests
 */
function doPost(e) {
  const startTime = Date.now();
  let user = null;
  
  try {
    // Validate request size
    if (e.postData && e.postData.contents.length > CONFIG.MAX_PAYLOAD_SIZE) {
      throw new Error("Request payload too large");
    }
    
    if (!e.postData || !e.postData.contents) {
      throw new Error("No request body provided");
    }

    // Parse and validate request body
    let body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch (parseError) {
      throw new Error("Invalid JSON in request body");
    }
    
    // Handle health check requests
    if (body.action === "health" || body.method === "HEALTH") {
      return healthCheck();
    }
    
    // Authenticate user
    user = authenticateUser(body.idToken);
    
    // Enforce rate limiting
    enforceRateLimit(user.email);
    
    // Validate required fields
    const { method, sheet, data } = body;
    if (!method) throw new Error("Missing 'method' field");
    if (!sheet) throw new Error("Missing 'sheet' field");
    
    // Sanitize inputs
    const sanitizedData = sanitizeInput(data);
    
    // Execute CRUD operation
    const result = handleCRUD(method, sheet, sanitizedData, user);
    
    // Log successful request
    if (CONFIG.LOG_REQUESTS) {
      logAccess(user.email, `${method}_${sheet}`, "success", Date.now() - startTime, e);
    }

    return corsResponse({ 
      status: "success", 
      data: result,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    });
    
  } catch (error) {
    // Log error
    if (CONFIG.LOG_ERRORS) {
      console.error("API Error:", error.message);
      logAccess(user?.email || "unknown", "error", error.message, Date.now() - startTime, e);
    }
    
    return corsResponse({ 
      status: "error", 
      message: error.message,
      timestamp: new Date().toISOString(),
      errorType: error.name || "UnknownError"
    });
  }
}

/**
 * ✅ Handle OPTIONS requests (CORS preflight)
 */
function doOptions(e) {
  // Return simple "OK" text response for OPTIONS preflight
  // Google Apps Script handles CORS automatically when deployed as "Anyone"
  return ContentService.createTextOutput("OK")
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * 📊 Handle GET requests - Health check and basic info
 */
function doGet(e) {
  // Check for health endpoint
  if (e.parameter && e.parameter.action === "health") {
    return healthCheck();
  }
  
  return corsResponse({ 
    status: "ready",
    message: "System Catalog API is running",
    version: CONFIG.API_VERSION,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "GET /?action=health",
      api: "POST / with JSON body"
    },
    documentation: "https://github.com/art-pontep/system-catalog/blob/main/postman/API_DOCUMENTATION.md"
  });
}

/* -------------------------------------------------------------------------- */
/*                                    CRUD API                                 */
/* -------------------------------------------------------------------------- */

/**
 * 🔄 Handle CRUD operations with enhanced security and validation
 */
function handleCRUD(method, sheetName, data, user) {
  try {
    // Validate sheet name
    if (!CONFIG.REQUIRED_SHEETS.includes(sheetName)) {
      throw new Error(`Invalid sheet name: ${sheetName}`);
    }
    
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      // Auto-create sheet if it doesn't exist
      const newSheet = createSheetWithHeaders(ss, sheetName);
      if (!newSheet) {
        throw new Error(`Unable to create or access sheet: ${sheetName}`);
      }
      sheet = newSheet; // Update sheet reference
    }

    const headers = getSheetHeaders(sheet);
    if (headers.length === 0) {
      // Only throw if the sheet is one we expected to have headers for
      if (CONFIG.REQUIRED_SHEETS.includes(sheetName)) {
          throw new Error(`Sheet ${sheetName} has no headers`);
      }
    }

    const rows = sheet.getDataRange().getValues();
    const dataRows = rows.slice(1); // exclude header row

    switch (method.toUpperCase()) {
      case "GET":
        return handleGetRequest(headers, dataRows, data);

      case "POST":
        return handlePostRequest(sheet, headers, data, user);

      case "PUT":
        return handlePutRequest(sheet, headers, dataRows, data, user);

      case "DELETE":
        return handleDeleteRequest(sheet, headers, dataRows, data, user);

      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  } catch (error) {
    console.error(`CRUD Error [${method} ${sheetName}]:`, error);
    throw error;
  }
}

/**
 * 📖 Handle GET requests with filtering and pagination
 */
function handleGetRequest(headers, dataRows, filters = {}) {
  let results = dataRows.map(row => 
    Object.fromEntries(headers.map((header, index) => [header, row[index] || ""]))
  );
  
  // Apply filters if provided
  if (filters && Object.keys(filters).length > 0) {
    results = results.filter(row => {
      return Object.entries(filters).every(([key, value]) => {
        // Only attempt to filter on existing keys
        if (!row.hasOwnProperty(key)) return true; 

        // Handle case where value is not a string (e.g., number, boolean filter)
        const rowValue = row[key] ? row[key].toString().toLowerCase() : "";
        const filterValue = value ? value.toString().toLowerCase() : "";

        return rowValue.includes(filterValue);
      });
    });
  }
  
  // Add metadata
  return {
    data: results,
    total: results.length,
    timestamp: new Date().toISOString()
  };
}

/**
 * ➕ Handle POST requests (Create)
 * * MODIFIED: Implements custom sequential ID generation for 'systems' and 'requirements'
 * based on 'System Type' and 'Type' respectively.
 */
function handlePostRequest(sheet, headers, data, user) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid data object for POST request");
  }
  
  // Custom ID generation logic based on sheet name and specific fields
  const sheetName = sheet.getName().toLowerCase();
  
  if (!data.ID) {
    if (sheetName === 'systems') {
      const systemType = (data['System Type'] || '').toLowerCase();
      
      if (systemType === 'internal') {
        data.ID = getNextSequentialId(sheet, 'INT');
      } else if (systemType === 'external') {
        data.ID = getNextSequentialId(sheet, 'EXT');
      }
    } else if (sheetName === 'requirements') {
      // New logic for 'requirements' sheet
      const requirementType = (data['Type'] || '').toLowerCase();
      
      if (requirementType === 'functional') {
        data.ID = getNextSequentialId(sheet, 'REQ');
      } else if (requirementType === 'non-functional') {
        data.ID = getNextSequentialId(sheet, 'NREQ');
      }
    }
  }
  
  // Fallback to generic ID if no ID was set by custom logic
  if (!data.ID) {
    data.ID = generateGenericId();
  }
  
  // Add audit fields
  data["Created By"] = user.email;
  data["Created Date"] = new Date().toISOString();
  data["Last Updated"] = new Date().toISOString();
  data["Last Updated By"] = user.email;
  
  // Validate required fields
  validateRequiredFields(data, headers);
  
  // Create row data
  const newRow = headers.map(header => data[header] || "");
  
  try {
    sheet.appendRow(newRow);
    return { 
      success: true,
      action: "created",
      id: data.ID,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to create record: ${error.message}`);
  }
}

/**
 * ✏️ Handle PUT requests (Update)
 */
function handlePutRequest(sheet, headers, dataRows, data, user) {
  if (!data || !data.ID) {
    throw new Error("Missing ID field for PUT request");
  }
  
  const idIndex = headers.indexOf("ID");
  if (idIndex === -1) {
    throw new Error("Sheet does not have an ID column");
  }
  
  // Find the row index (Spreadsheet is 1-based, dataRows is 0-based, header is 1 row)
  const updateRowIndex = dataRows.findIndex(row => row[idIndex] == data.ID);
  
  if (updateRowIndex === -1) {
    throw new Error(`Record with ID '${data.ID}' not found`);
  }
  
  // Sheet row index is updateRowIndex + 2 (1 for 1-based index, 1 for header row)
  const actualRowIndex = updateRowIndex + 2; 

  // Add audit fields
  data["Last Updated"] = new Date().toISOString();
  data["Last Updated By"] = user.email;
  
  // Prepare updates array
  const updates = [];

  // Identify provided fields to update
  headers.forEach((header, columnIndex) => {
    // Check if the header is present in the data object and is not a protected field
    if (header in data && header !== "Created By" && header !== "Created Date") {
      updates.push({
          row: actualRowIndex,
          col: columnIndex + 1, // 1-based column index
          value: data[header]
      });
    }
  });

  if (updates.length > 0) {
    // Iterate through the identified cells and use setValue(). 
    updates.forEach(update => {
        // Use getRange(row, column) which accepts 1-based indices
        sheet.getRange(update.row, update.col).setValue(update.value);
    });
  }
  
  return { 
    success: true,
    action: "updated",
    id: data.ID,
    timestamp: new Date().toISOString()
  };
}

/**
 * 🗑️ Handle DELETE requests
 */
function handleDeleteRequest(sheet, headers, dataRows, data, user) {
  if (!data || !data.ID) {
    throw new Error("Missing ID field for DELETE request");
  }
  
  const idIndex = headers.indexOf("ID");
  if (idIndex === -1) {
    throw new Error("Sheet does not have an ID column");
  }
  
  // Find the row index (Spreadsheet row index = deleteRowIndex + 2)
  const deleteRowIndex = dataRows.findIndex(row => row[idIndex] == data.ID);
  
  if (deleteRowIndex === -1) {
    throw new Error(`Record with ID '${data.ID}' not found`);
  }
  
  try {
    // 1️⃣ Delete the main record
    sheet.deleteRow(deleteRowIndex + 2); // +2 because of header and 1-based indexing
    
    // 2️⃣ Log deletion
    logDeletion(user.email, data.ID, sheet.getName());

    // 3️⃣ If deleting a system, cascade delete related requirements
    if (sheet.getName().toLowerCase() === "systems") {
      deleteAssociatedRequirements(data.ID, user);
    }
    
    return { 
      success: true,
      action: "deleted",
      id: data.ID,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    throw new Error(`Failed to delete record: ${error.message}`);
  }
}

/**
 * Deletes all requirements associated with a system ID
 */
function deleteAssociatedRequirements(systemID, user) {
  const REQUIREMENTS_SHEET_NAME = "Requirements";
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const reqSheet = ss.getSheetByName(REQUIREMENTS_SHEET_NAME);
  if (!reqSheet) return;

  const reqData = reqSheet.getDataRange().getValues();
  const rows = reqData.slice(1);


  const idColIndex = 0;     // Requirement ID column A 
  const systemColIndex = 1; // System ID is in column B 

  // Loop backwards to safely delete rows
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i][systemColIndex] == systemID) {
      reqSheet.deleteRow(i + 2); // +2 because header row
      logDeletion(user.email, rows[i][idColIndex], "requirements");
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                              AUTH + RATE LIMITING                           */
/* -------------------------------------------------------------------------- */

/**
 * 🔐 Validate Google ID Token with enhanced security
 */
function authenticateUser(idToken) {
  if (!idToken || typeof idToken !== 'string') {
    throw new Error("Missing or invalid ID token");
  }
  
  try {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    
    if (responseCode !== 200) {
      throw new Error(`Token validation failed with status: ${responseCode}`);
    }
    
    const user = JSON.parse(response.getContentText());
    
    // Validate token response
    if (user.error_description) {
      throw new Error(`Invalid ID token: ${user.error_description}`);
    }
    
    // Validate audience (client ID)
    if (user.aud !== CONFIG.CLIENT_ID) {
      throw new Error("Invalid token audience");
    }
    
    // Check token expiry
    const now = Math.floor(Date.now() / 1000);
    if (parseInt(user.exp, 10) < now) {
      throw new Error("Token expired");
    }
    
    // Validate email verification
    if (!user.email_verified) {
      throw new Error("Email not verified");
    }
    
    // Check user authorization
    if (CONFIG.ALLOWED_USERS && CONFIG.ALLOWED_USERS.length > 0) {
      if (!CONFIG.ALLOWED_USERS.includes(user.email.toLowerCase())) {
        throw new Error("Unauthorized user");
      }
    }
    
    // Log successful authentication
    if (CONFIG.LOG_AUTH_EVENTS) {
      logAuthEvent(user, 'login', 'success');
    }
    
    return {
      email: user.email,
      name: user.name,
      picture: user.picture,
      sub: user.sub,
      aud: user.aud,
      exp: user.exp
    };
    
  } catch (error) {
    // Log failed authentication
    if (CONFIG.LOG_AUTH_EVENTS) {
      logAuthEvent({ email: 'unknown' }, 'login', 'failed', { error: error.message });
    }
    throw error;
  }
}

/**
 * 🛡️ Enhanced rate limiting with user-specific limits
 */
function enforceRateLimit(email) {
  try {
    // Check if rate limiting is enabled
    if (!CONFIG.RATE_LIMIT || !CONFIG.RATE_LIMIT.ENABLED) {
      return true;
    }
    
    const cache = CacheService.getScriptCache();
    const key = `rl_${email}`;
    const windowKey = `rl_window_${email}`;
    const now = Date.now();
    
    // Get configuration with fallbacks
    const maxRequests = CONFIG.RATE_LIMIT.MAX_REQUESTS || 30;
    const windowMs = CONFIG.RATE_LIMIT.WINDOW_MS || 60000; // 1 minute default

    let currentCount = parseInt(cache.get(key) || "0", 10);
    let windowStart = parseInt(cache.get(windowKey) || "0", 10);

    // Reset counter if window has passed
    if (now - windowStart > windowMs) {
      cache.put(key, "1", Math.ceil(windowMs / 1000));
      cache.put(windowKey, now.toString(), Math.ceil(windowMs / 1000));
      return true;
    }

    // Check if limit exceeded
    if (currentCount >= maxRequests) {
      const remainingTime = Math.ceil((windowMs - (now - windowStart)) / 1000);
      throw new Error(`Rate limit exceeded. Try again in ${remainingTime} seconds.`);
    }

    // Increment counter
    cache.put(key, (currentCount + 1).toString(), Math.ceil(windowMs / 1000));
    return true;
    
  } catch (error) {
    if (error.message.includes('Rate limit exceeded')) {
      throw error;
    }
    console.error('Rate limiting error:', error);
    return true; // Allow request if rate limiting fails
  }
}

/* -------------------------------------------------------------------------- */
/*                                    HELPERS                                  */
/* -------------------------------------------------------------------------- */

/** ✅ Standardized CORS Response */
function corsResponse(obj, statusCode = 200) {
  // Create JSON output
  const output = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Note: Google Apps Script handles CORS automatically for web apps
  // Manual header setting is not supported in Apps Script
  // CORS is controlled by the deployment settings (Anyone/Anyone with link)
  
  return output;
}

/** * ✅ Enhanced logging with structured data. 
 * Fix: Added check for missing headers in existing sheet.
 */
function logAccess(email, action, status = "success", processingTime = 0, e = null) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let logSheet = ss.getSheetByName("access_log");
    
    const LOG_HEADERS = ["Timestamp", "Email", "Action", "Status", "Processing Time (ms)"];
    
    // 1. Check if log sheet exists
    if (!logSheet) {
      logSheet = ss.insertSheet("access_log");
      
      // 2. Set headers on the new sheet
      logSheet.getRange(1, 1, 1, LOG_HEADERS.length).setValues([LOG_HEADERS]);
    
    } else {
      // 3. If sheet exists, check if the header row is missing (A1 is empty)
      const firstCell = logSheet.getRange("A1").getValue();
      if (!firstCell) {
        logSheet.getRange(1, 1, 1, LOG_HEADERS.length).setValues([LOG_HEADERS]);
      }
    }

    logSheet.appendRow([
      new Date(),
      email || "unknown",
      action,
      status,
      processingTime
    ]);
    
  } catch (err) {
    if (CONFIG.DEBUG_MODE) {
      console.error("Log error:", err.message);
    }
  }
}

/** * 🗑️ Log deletion for audit trail
 * Fix: Added check for missing headers in existing sheet.
 */
function logDeletion(email, recordId, sheetName) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let auditSheet = ss.getSheetByName("deletion_log");
    
    const DELETION_HEADERS = ["Timestamp", "User Email", "Sheet Name", "Record ID"];
    
    if (!auditSheet) {
      auditSheet = ss.insertSheet("deletion_log");
      auditSheet.getRange(1, 1, 1, DELETION_HEADERS.length).setValues([DELETION_HEADERS]);
    } else {
      const firstCell = auditSheet.getRange("A1").getValue();
      if (!firstCell) {
        auditSheet.getRange(1, 1, 1, DELETION_HEADERS.length).setValues([DELETION_HEADERS]);
      }
    }
    

    auditSheet.appendRow([
      new Date(),
      email,
      sheetName,
      recordId
    ]);
    
  } catch (error) {
    console.error('Error logging deletion:', error);
  }
}

/** * 📝 Log authentication events
 * Fix: Added check for missing headers in existing sheet.
 */
function logAuthEvent(user, action, status, additionalInfo = {}) {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      user: user?.email || 'unknown',
      action: action,
      status: status
    };
    
    console.log('Auth Event:', JSON.stringify(logEntry));
    
    // Log to sheet for persistent audit trail
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let authLogSheet = ss.getSheetByName("auth_log");
    
    const AUTH_HEADERS = ["Timestamp", "User Email", "Action", "Status"];

    if (!authLogSheet) {
      authLogSheet = ss.insertSheet("auth_log");
      authLogSheet.getRange(1, 1, 1, AUTH_HEADERS.length).setValues([AUTH_HEADERS]);
    } else {
      const firstCell = authLogSheet.getRange("A1").getValue();
      if (!firstCell) {
        authLogSheet.getRange(1, 1, 1, AUTH_HEADERS.length).setValues([AUTH_HEADERS]);
      }
    }
    
    authLogSheet.appendRow([
      new Date(),
      logEntry.user,
      logEntry.action,
      logEntry.status
    ]);
    
  } catch (error) {
    console.error('Failed to log auth event:', error);
  }
}

/* -------------------------------------------------------------------------- */
/*                                UTILITY FUNCTIONS                            */
/* -------------------------------------------------------------------------- */

/**
 * 🧹 Sanitize input data to prevent common injection attacks (e.g., XSS)
 * Applies recursively to objects and arrays.
 */
function sanitizeInput(data) {
  // Helper to sanitize a string
  function sanitizeString(str) {
    if (!str) return '';

    // Trim and escape HTML special characters
    str = str.trim()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");

    // Remove inline event handlers and dangerous patterns
    str = str
      .replace(/on\w+\s*=/gi, "")      // onclick, onerror, onload, etc.
      .replace(/javascript:/gi, "")
      .replace(/vbscript:/gi, "")
      .replace(/expression\(/gi, "")    // CSS expression injection
      .replace(/<script.*?>.*?<\/script>/gi, "")
      .replace(/<style.*?>.*?<\/style>/gi, "")
      .replace(/<iframe.*?>.*?<\/iframe>/gi, "");

    return str;
  }

  // Recursively handle arrays
  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }

  // Recursively handle objects
  if (typeof data === 'object' && data !== null) {
    const sanitizedObj = {};
    for (var key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitizedObj[key] = sanitizeInput(data[key]);
      }
    }
    return sanitizedObj;
  }

  // Sanitize string
  if (typeof data === 'string') {
    return sanitizeString(data);
  }

  // Return other types (number, boolean, null) as-is
  return data;
}

/**
 * 🔢 Finds the next sequential ID for a given prefix (e.g., 'INT-0001').
 */
function getNextSequentialId(sheet, prefix) {
  const headers = getSheetHeaders(sheet);
  const idIndex = headers.indexOf("ID");
  
  // Default to 1 if no ID column or no data row
  // We use 4 digits for formatting by default
  const defaultId = `${prefix}-${String(1).padStart(4, '0')}`;
  if (idIndex === -1 || sheet.getLastRow() <= 1) {
    return defaultId; 
  }

  try {
    // Fetch all IDs, skipping the header row
    const ids = sheet.getRange(2, idIndex + 1, sheet.getLastRow() - 1, 1)
      .getValues()
      .flat()
      .filter(id => typeof id === 'string' && id.startsWith(prefix));

    let maxNum = 0;
    // Regex to match the prefix followed by a dash and exactly four digits
    // The prefix needs to be escaped in case it contains regex special characters (e.g., NONREQ-0001)
    const escapedPrefix = prefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`^${escapedPrefix}-(\\d{4})$`);

    ids.forEach(id => {
      const match = id.match(regex);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) {
          maxNum = num;
        }
      }
    });

    // Increment and format to 4 digits
    const nextNum = maxNum + 1;
    return `${prefix}-${String(nextNum).padStart(4, '0')}`;
  } catch (error) {
    console.error(`Error generating sequential ID for prefix ${prefix}:`, error);
    // Fallback to the generic ID if something goes wrong
    return generateGenericId(); 
  }
}

/**
 * 🆔 Generate generic unique ID for new records
 * NOTE: Renamed from generateUniqueId for clarity as custom ID logic was added.
 */
function generateGenericId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${timestamp}_${random}`.toUpperCase();
}


/**
 * 📋 Get sheet headers safely
 */
function getSheetHeaders(sheet) {
  try {
    if (sheet.getLastColumn() === 0) return [];
    return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  } catch (error) {
    console.error('Error getting sheet headers:', error);
    return [];
  }
}

/**
 * 🏗️ Create new sheet with standard headers
 */
function createSheetWithHeaders(spreadsheet, sheetName) {
  try {
    const newSheet = spreadsheet.insertSheet(sheetName);

    // Default headers for any sheet name not explicitly defined
    let headers = ["ID", "Name", "Description", "Status", "Created Date", "Created By", "Last Updated", "Last Updated By"];

    // Define headers based on the provided sheet name
    switch (sheetName.toLowerCase()) {
      case "systems":
        // Headers derived from the user's "Systems" list
        headers = [
          "ID", "Name", "Description", "Business Owner", "Technical Owner",
          "Overall Status", "Category", "System Type", "Go Live Date", "Goal",
          "Created Date", "Created By", "Last Updated", "Last Updated By"
        ];
        break;

      case "requirements":
        // Headers derived from the user's "Requirements" list
        headers = [
          "ID", "System ID", "Title", "Type", "Priority",
          "Status", "Created Date", "Created By", "Last Updated", "Last Updated By"
        ];
        break;

      case "documents":
        // Headers derived from the user's "Documents" list
        // Note: The 'ID' column was excluded from the user's new documents list.
        headers = [
          "System ID", "Document Type", "Document Name",
          "Category", "Completed", "Reviewer", "Document Link",
          "Created Date", "Created By", "Last Updated", "Last Updated By"
        ];
        break;

      default:
        // Use default headers defined above
        break;
    }

    // Set the headers in the first row
    newSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Format header row (bold font, light grey background)
    const headerRange = newSheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold").setBackground("#e0e0e0");
    
    // Auto-resize columns to fit content
    newSheet.autoResizeColumns(1, headers.length);

    return newSheet;

  } catch (error) {
    console.error(`Error creating sheet ${sheetName}:`, error);
    return null;
  }
}

/**
 * ✅ Validate required fields in data
 */
function validateRequiredFields(data, headers) {
  // NOTE: This assumes 'ID' and 'Name' are globally required if they are in the headers
  const requiredFields = ["ID", "Name"]; 
  
  // Specific required fields for the system sheets could be added here
  
  for (const field of requiredFields) {
    if (headers.includes(field) && (!data[field] || data[field].toString().trim() === "")) {
      throw new Error(`Required field '${field}' is missing or empty`);
    }
  }
}

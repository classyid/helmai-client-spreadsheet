/**
 * Konfigurasi API toko helm
 */
const CONFIG = {
  baseUrl: "URL API", // Ganti dengan URL atau IP server Anda
  apiKey: "API-KEY", // Ganti dengan API key Anda
  timeout: 30000 // Timeout dalam milidetik
};

/**
 * Mendapatkan informasi produk helm
 * @returns {Object} Informasi produk, promo, dll.
 */
function getHelmInfo() {
  try {
    const response = makeApiRequest("GET", "/api/helm/info");
    return response;
  } catch (error) {
    Logger.log("Error getting helm info: " + error);
    throw new Error("Gagal mendapatkan informasi produk: " + error);
  }
}

/**
 * Mengirim pesan chat ke asisten toko helm
 * @param {string} message - Pesan yang ingin dikirim
 * @param {string} mode - Mode chat (cs, konten, sales)
 * @param {string} sessionId - (Opsional) ID sesi untuk melanjutkan percakapan
 * @returns {Object} Respon dari asisten
 */
function sendChatMessage(message, mode = "cs", sessionId = null) {
  try {
    const payload = {
      message: message,
      mode: mode
    };
    
    if (sessionId) {
      payload.session_id = sessionId;
    }
    
    const response = makeApiRequest("POST", "/api/helm/chat", payload);
    return response;
  } catch (error) {
    Logger.log("Error sending chat message: " + error);
    throw new Error("Gagal mengirim pesan: " + error);
  }
}

/**
 * Mendapatkan daftar sesi chat aktif
 * @returns {Object} Daftar sesi
 */
function getActiveSessions() {
  try {
    const response = makeApiRequest("GET", "/api/helm/sessions");
    return response;
  } catch (error) {
    Logger.log("Error getting active sessions: " + error);
    throw new Error("Gagal mendapatkan sesi aktif: " + error);
  }
}

/**
 * Membuat permintaan ke API toko helm
 * @param {string} method - Metode HTTP (GET/POST)
 * @param {string} endpoint - Endpoint API
 * @param {Object} payload - Data untuk dikirim (untuk POST)
 * @returns {Object} Respons dari API
 */
function makeApiRequest(method, endpoint, payload = null) {
  const url = CONFIG.baseUrl + endpoint;
  
  const options = {
    method: method,
    headers: {
      "X-API-Key": CONFIG.apiKey
    },
    muteHttpExceptions: true,
    timeout: CONFIG.timeout
  };
  
  if (payload && method === "POST") {
    options.contentType = "application/json";
    options.payload = JSON.stringify(payload);
  }
  
  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const responseText = response.getContentText();
  
  if (responseCode < 200 || responseCode >= 300) {
    Logger.log("API error: " + responseCode + " - " + responseText);
    throw new Error("API error " + responseCode + ": " + responseText);
  }
  
  return JSON.parse(responseText);
}

/**
 * Mengisi spreadsheet dengan data produk
 * @param {string} sheetName - Nama sheet yang akan diisi
 */
function populateProductsSheet(sheetName = "Products") {
  try {
    // Mendapatkan spreadsheet aktif
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    
    // Buat sheet jika belum ada
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    } else {
      // Bersihkan sheet yang sudah ada
      sheet.clear();
    }
    
    // Dapatkan data produk
    const helmData = getHelmInfo();
    if (!helmData.success) {
      throw new Error("Gagal mendapatkan data: " + JSON.stringify(helmData));
    }
    
    const products = helmData.data.products;
    
    // Buat header
    sheet.appendRow([
      "ID", "Nama", "Brand", "Kategori", "Harga", "Warna", "Stok"
    ]);
    
    // Format header
    sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#f3f3f3");
    
    // Isi data produk
    let rowData = [];
    products.forEach(product => {
      const colors = product.colors.map(c => c.name).join(", ");
      rowData.push([
        product.id,
        product.name,
        product.brand,
        product.category,
        product.price,
        colors,
        product.stock || "N/A"
      ]);
    });
    
    if (rowData.length > 0) {
      sheet.getRange(2, 1, rowData.length, 7).setValues(rowData);
    }
    
    // Auto-resize kolom
    sheet.autoResizeColumns(1, 7);
    
    // Tambahkan tabel promosi
    sheet.appendRow([]);
    const promoStartRow = rowData.length + 3;
    sheet.getRange(promoStartRow, 1).setValue("PROMOSI AKTIF");
    sheet.getRange(promoStartRow, 1).setFontWeight("bold");
    
    sheet.appendRow(["Nama", "Deskripsi", "Diskon", "Tanggal Mulai", "Tanggal Selesai"]);
    sheet.getRange(promoStartRow + 1, 1, 1, 5).setFontWeight("bold").setBackground("#f3f3f3");
    
    rowData = [];
    helmData.data.promotions.forEach(promo => {
      rowData.push([
        promo.name,
        promo.description,
        promo.discount_percentage + "%",
        promo.start_date,
        promo.end_date
      ]);
    });
    
    if (rowData.length > 0) {
      sheet.getRange(promoStartRow + 2, 1, rowData.length, 5).setValues(rowData);
    }
    
    sheet.autoResizeColumns(1, 5);
    
    return "Berhasil mengisi data produk di sheet '" + sheetName + "'";
  } catch (error) {
    Logger.log("Error populating sheet: " + error);
    return "Error: " + error.message;
  }
}

/**
 * Membuat UI sidebar untuk chat dengan asisten toko helm
 */
function showChatSidebar() {
  const html = HtmlService.createHtmlOutput(`
    <html>
      <head>
        <base target="_top">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 10px; }
          .container { display: flex; flex-direction: column; height: 100%; }
          .chat-container { flex-grow: 1; overflow-y: auto; margin-bottom: 10px; border: 1px solid #ccc; padding: 10px; }
          .message { margin-bottom: 10px; padding: 8px; border-radius: 5px; max-width: 85%; }
          .user-message { background-color: #DCF8C6; align-self: flex-end; margin-left: auto; }
          .assistant-message { background-color: #F1F0F0; }
          .input-container { display: flex; }
          select, input, button { padding: 8px; margin-right: 5px; }
          input { flex-grow: 1; }
          .system-message { color: #888; font-style: italic; text-align: center; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h3>Asisten Toko Helm</h3>
          <div class="chat-container" id="chatContainer">
            <div class="system-message">Selamat datang di Asisten Toko Helm! Silakan pilih mode dan mulai chat.</div>
          </div>
          <div class="input-container">
            <select id="modeSelect">
              <option value="cs">CS</option>
              <option value="konten">Konten</option>
              <option value="sales">Sales</option>
            </select>
            <input type="text" id="messageInput" placeholder="Ketik pesan..." />
            <button onclick="sendMessage()">Kirim</button>
          </div>
        </div>
        <script>
          let sessionId = null;
          
          function addMessage(text, type) {
            const chatContainer = document.getElementById('chatContainer');
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add(type + '-message');
            messageDiv.textContent = text;
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
          }
          
          function addSystemMessage(text) {
            const chatContainer = document.getElementById('chatContainer');
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('system-message');
            messageDiv.textContent = text;
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
          }
          
          function sendMessage() {
            const messageInput = document.getElementById('messageInput');
            const modeSelect = document.getElementById('modeSelect');
            const message = messageInput.value.trim();
            const mode = modeSelect.value;
            
            if (!message) return;
            
            addMessage(message, 'user');
            messageInput.value = '';
            
            google.script.run
              .withSuccessHandler(function(response) {
                if (response.success) {
                  sessionId = response.data.session_id;
                  addMessage(response.data.response, 'assistant');
                } else {
                  addSystemMessage('Error: ' + response.error);
                }
              })
              .withFailureHandler(function(error) {
                addSystemMessage('Error: ' + error);
              })
              .sendChatMessage(message, mode, sessionId);
          }
          
          // Memungkinkan pengiriman dengan tombol Enter
          document.getElementById('messageInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
              sendMessage();
            }
          });
        </script>
      </body>
    </html>
  `).setTitle('Asisten Toko Helm').setWidth(300);
  
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Menambahkan menu ke UI spreadsheet
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Toko Helm')
    .addItem('Update Data Produk', 'populateProductsSheet')
    .addItem('Chat dengan Asisten', 'showChatSidebar')
    .addToUi();
}

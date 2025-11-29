const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Handle API Endpoint for Booking
  if (req.method === 'POST' && parsedUrl.pathname === '/api/book') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const bookingData = JSON.parse(body);
        const csvLine = `"${bookingData.fullName}","${bookingData.email}","${bookingData.contact}","${bookingData.date}","${bookingData.time}","${bookingData.therapyType}","${new Date().toISOString()}"\n`;
        
        const csvFile = path.join(__dirname, 'bookings.csv');
        
        // Add header if file doesn't exist
        if (!fs.existsSync(csvFile)) {
          fs.writeFileSync(csvFile, 'Name,Email,Contact,Date,Time,Type,Timestamp\n');
        }
        
        fs.appendFileSync(csvFile, csvLine);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Booking saved successfully' }));
      } catch (error) {
        console.error('Error saving booking:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
      }
    });
    return;
  }

  // Serve Static Files
  let filePath = path.join(__dirname, parsedUrl.pathname === '/' ? 'index.html' : parsedUrl.pathname);
  
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

console.log(`Server running at http://localhost:${PORT}/`);
server.listen(PORT);

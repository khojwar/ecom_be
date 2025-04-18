const http = require('http');

// server
const server = http.createServer((req, res) => {
    // console.log(req);
    console.log(req.url, req.method);
    
    
    res.end('Hello World!');        // server application
})

const PORT = 9005; // port number
const HOST = 'localhost'; // host name

// server listen
server.listen(PORT, HOST, (err) => {
    console.log("Server is running on port:", PORT);
    console.log("Press Ctrl + C to stop the server.");
})




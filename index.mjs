import Server from 'bare-server-node';
import http from 'http';
import nodeStatic from 'node-static';
import chalk from 'chalk';

const bare = new Server('/bare/', '');
const serve = new nodeStatic.Server('static/');

const server = http.createServer();

server.on('request', (request, response) => {
    if (bare.route_request(request, response)) return true;
    serve.serve(request, response);
});

server.on('upgrade', (req, socket, head) => {
    if (bare.route_upgrade(req, socket, head)) return;
    socket.end();
});

server.listen(process.env.PORT || 8080);
console.log(chalk.bold.hex("#8423cf")(`----------------\nGalaxy\nhttp://localhost:${process.env.PORT || 8080}\n----------------`));
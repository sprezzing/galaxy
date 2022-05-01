import Server from 'bare-server-node';
import http from 'http';
import nodeStatic from 'node-static';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();
const bare = new Server('/bare/', '');
const serve = new nodeStatic.Server('static/');
const fakeServe = new nodeStatic.Server('BlacklistServe/');

const server = http.createServer();

server.on('request', (request, response) => {
    /* Example env file: 

    BlacklistedIPs="ip1,ip2,ip3"

    */
    var BlacklistedIPs = process.env.BlacklistedIPs;
    let blacklist = BlacklistedIPs.split(",");
    var getClientIp = function (req) {
        var ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
        if (!ipAddress) {
            return '';
        }

        if (ipAddress.substr(0, 7) == "::ffff:") {
            ipAddress = ipAddress.substr(7)
        } return ipAddress;
    };

    // if the users ip is blacklisted, then we will serve the bare server

    var ipAddress = getClientIp(request);
    if (blacklist.includes(ipAddress)) {
        console.log(chalk.red(`[-] ${ipAddress} Tried entering main site but is blacklisted`));
        fakeServe.serve(request, response);
    }
    else {
        if (bare.route_request(request, response))
            return true;

        serve.serve(request, response);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.route_upgrade(req, socket, head))
        return;
    socket.end();
});


server.listen(process.env.PORT || 8080);
console.log(chalk.bold.hex("#8423cf")(`----------------\nGalaxy\nhttp://localhost:${process.env.PORT || 8080}\n----------------`));

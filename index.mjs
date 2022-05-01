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
  var BlacklistedIPs = process.env.BlacklistedIPs || "18.237.145.219,34.213.241.18,54.184.142.71,34.219.54.89,52.13.31.12,52.89.157.185,34.208.60.206,3.80.101.141,54.90.242.158,54.172.185.65,3.83.250.144,18.209.180.25,54.167.181.168,54.166.136.197, 52.207.207.52,54.252.242.153,3.104.121.59,34.253.198.121,63.33.56.11,34.250.114.219,54.171.251.199";
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

    // if the users ip is blacklisted, then we will serve the blacklisted dir

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

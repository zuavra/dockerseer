process.on('unhandledRejection', (reason, P) => {
    console.error(reason, 'Unhandled promise:', P);
});
process.on('uncaughtException', e => {
    console.error('Uncaught exception:', e);
    process.exit(1);
});

import Crumbware from "crumbware";
import http from 'node:http';
import { URL } from 'node:url';
import {Docker} from 'docker-bowline';

const dockSock = new Docker({
    socket: "/var/run/docker.sock"
});

const app = new Crumbware(http.createServer(), URL);

app.use('/', async (_, res) => {
    const cList = (await dockSock.containers.list()).toSorted(
        (a, b) => (a.Names[0] < b.Names[0] ? -1 : 0) + (a.State == 'running' ? 0 : 1)
    );
    res.write('<head>');
    res.write('<title>Docker containers</title>');
    // res.write('<script type="text/javascript">');
    // res.write(htmlResources.js);
    // res.write('</script>');
    // res.write('<style type="text/css">');
    // res.write(htmlResources.css);
    // res.write('</style>');
    res.write('</head>');
    res.write('<body>');
    res.write('<table border=2>');
    res.write('<tr><th>Name<th>State<th>Image<th>Uptime<th>Network<th>Ports');
    for (const container of cList) {
        res.write('<tr>');
        res.write(`<td>` + container.Names.join(', '));
        res.write((container.State == 'running' ? '<td>' : '<th>') + container.State);
        res.write(`<td>` + container.Image);
        res.write(`<td>` + container.Status);
        res.write('<td>' + (container.HostConfig.NetworkMode === 'host'
            ? '<i>HOST</i>'
            : Object.keys(container.NetworkSettings.Networks).join(', ')));
        res.write('<td>' + container.Ports.filter(P => P.IP != '::').map(P => {
            return P.PrivatePort + (P.PublicPort ? `<b>:${P.PublicPort}</b>` : '') + '/' + P.Type;
        }).join(', '));
        // console.log(container);
    }
    res.write('</table>');
    res.write('</body>');
    res.end();
});

console.log('READY');
app.listen(process.env.PORT || 9348, process.env.HOST || '0.0.0.0');

# dockerseer

A very simple Docker dashboard made with Node.js.

This is still being written so it's very rough right now but I'm using it and I will keep improving it.

It makes a HTTP server that listens on 9348 by default and responds to / with a HTML page. That's it for now.

Right now it can show a list of running containers and some essential information about each of them (network, ports and uptime).

I plan to add the ability to show containers in all states, buttons to stop, start, restart containers, and perhaps information about images, volumes, networks and so on.

You can use it as-is (run it through node) or there's an included Dockerfile if you want to build a container for it.

import {Server} from "socket.io";

export default function SocketHandler(req, res) {
    if (res.socket.server.io) {
        res.end();
        return;
    }

    const io = new Server(res.socket.server, {
        path: "/api/socket_io",
        addTrailingSlash: false
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
        socket.on("chat-message", (message) => {
            console.log('incoming chat message', message)

            // send message to all client subscribers
            io.emit("receive-chat-message", message);
        })
    });


    console.log("Setting up socket");
    res.end();
}
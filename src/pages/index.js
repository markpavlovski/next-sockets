import React, {useEffect, useState} from "react";
import io from "socket.io-client";


let socket;
let socketInitialized = false;


const Home = () => {
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [allMessages, setAllMessages] = useState([])

    useEffect(() => {
        socketInitializer();

        return () => {
            socket?.disconnect();
        };
    }, []);

    async function socketInitializer() {
        await fetch("/api/socket");

        if (!socketInitialized) {
            socket = io(undefined, {
                path: '/api/socket_io',
            });

            socket.on("receive-chat-message", (message) => {
                console.log("received message", message)
                setAllMessages(currentMessages => [...currentMessages, message])
            });

            socketInitialized = true;
        }

    }


    const submitMessage = () => {
        socket.emit('chat-message', {username, message})
        setMessage('')
    }

    return (
        <form>
            <div style={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
                margin: "4rem auto",
                gap: "1rem"
            }}>
                <h1>Chat app</h1>
                <input value={username} onChange={(e) => setUsername(e.target.value)}
                       placeholder="enter your username"/>
                <input
                    placeholder="enter your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={submitMessage} disabled={!message}>Send Message</button>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "4rem",
                        gap: "0.5rem"
                    }}
                >
                    <h1>All Messages</h1>
                    {allMessages.length
                        ? allMessages.map(message =>
                            <div>
                                <div>{message.username}</div>
                                <div>{message.message}</div>
                            </div>)
                        : "No Messages yet"
                    }
                </div>

            </div>
        </form>
    );
};

export default Home;


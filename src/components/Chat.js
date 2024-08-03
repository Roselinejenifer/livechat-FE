import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Button, Card, Container, IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {jwtDecode} from 'jwt-decode'; 
import "./chat.css";
import { useNavigate } from 'react-router-dom';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const socketRef = useRef(null);
    const messageEndRef = useRef(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const decoded = token ? jwtDecode(token) : {};
    const userId = decoded?.id;
    const username = decoded?.username;

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const response = await axios.get('https://livechat-be-dzwh.onrender.com/api/chat', config);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        const handleSocketErrors = (error) => {
            console.error('Socket error:', error);
        };

        socketRef.current = io('https://livechat-be-dzwh.onrender.com', {
            auth: { token }
        });

        socketRef.current.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socketRef.current.on('message', (data) => {
            console.log('Received message:', data);
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        socketRef.current.on('connect_error', handleSocketErrors);
        socketRef.current.on('error', handleSocketErrors);

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [token]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!token) return;
    
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
    
        const messageData = { text, sender: userId };
    
        try {
            // Send message to the server
            const response = await axios.post('https://livechat-be-dzwh.onrender.com/api/chat', messageData, config);
            
            // Check response
            if (response.data.msg === 'Message sent') {
                console.log('Message sent successfully.');
    
                // Fetch updated messages
                const updatedMessagesResponse = await axios.get('https://livechat-be-dzwh.onrender.com/api/chat', config);
                console.log('Updated messages fetched:', updatedMessagesResponse.data);
    
                // Update the state with new messages
                setMessages(updatedMessagesResponse.data);
    
                // Emit socket event
                socketRef.current.emit('message', messageData);
    
                // Clear text input
                setText('');
            } else {
                console.error('Unexpected response:', response.data);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    useEffect(() => {
        socketRef.current = io('https://livechat-be-dzwh.onrender.com');
    
        socketRef.current.on('message', (newMessage) => {
            console.log('New message received:', newMessage);
            
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
    
        // Clean up on unmount
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <Container className="container">
            <div className="chat">
                <Card sx={{ display: "flex" }}>
                    <div className="message-container">
                        {messages.length === 0 ? (
                            <p>No messages yet</p>
                        ) : (
                            messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={msg.sender === username ? 'sent-message' : 'received-message'}
                                >
                                    <strong>{msg.sender === username ? 'You' : msg.sender}: </strong>{msg.text}
                                </div>
                            ))
                        )}
                        <div ref={messageEndRef} />
                    </div>
                </Card>
                <div className="input-container">
                    <TextField
                        id="standard-basic"
                        placeholder="Type a message"
                        variant="standard"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <IconButton onClick={sendMessage}><SendIcon /></IconButton>
                </div>
                <Button onClick={logout} sx={{ position: "relative", right: 0 }}>Logout</Button>
            </div>
        </Container>
    );
};

export default Chat;

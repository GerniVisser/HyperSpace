import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';


export default function Home() {
    
    const socket = io('http://localhost:4000'); 
    const [items, setItems] = useState([]);
    
    useEffect(() => {
        console.log('Connecting to serr');
        socket.on('connect', () => {
            console.log('Connected to server');
        });
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
        socket.on('updateItems', (data) => {
            console.log('Received data from server', data);
            setItems(data);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
        <h2>Home</h2>
        <ul>
            {items.map((item: any, index) => (
                <li key={index}>{item.name}</li>
            ))}
        </ul>
        </div>
    );
  }
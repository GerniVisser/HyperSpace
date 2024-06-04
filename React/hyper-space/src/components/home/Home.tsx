import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Modal from '../modal/Modal';
import './Home.css';


export default function Home() {
    
    const socket = io('http://localhost:4000'); 
    const [items, setItems] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newItem, setNewItem] = useState('');
    
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

    const handleSubmit = (event: any) => {
        event.preventDefault();
        try {
            socket.emit('newItem', { name: newItem });
            setNewItem('');
        } catch (error) {
            console.error('Error submitting new item:', error);
        }
    };

    return (
        <React.Fragment>
            <div className='home-container'>
                <button
                    onClick={() => setModalOpen(true)}
                >
                    Click Here
                </button>
            </div>

            <Modal
                isOpen={isModalOpen}
                hasCloseBtn={true}
                onClose={() => setModalOpen(false)}
            >
                <ul>
                    {items.map((item: any, index) => (
                        <li key={index}>{item.name}</li>
                    ))}
                </ul>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={newItem}
                        onChange={(event) => setNewItem(event.target.value)}
                        placeholder="Enter new item"
                    />
                    <button type="submit">Submit</button>
                </form>
            </Modal>
        </React.Fragment>
    );
  }
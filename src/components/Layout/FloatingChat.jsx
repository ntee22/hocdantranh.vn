import React from 'react';
import { MessageCircle } from 'lucide-react';
import './FloatingChat.css';

const FloatingChat = () => {
    return (
        <a
            href="https://www.facebook.com/messages/t/494579524037541"
            target="_blank"
            rel="noopener noreferrer"
            className="floating-chat"
            title="Chat with us on Messenger"
        >
            <MessageCircle size={32} />
        </a>
    );
};

export default FloatingChat;

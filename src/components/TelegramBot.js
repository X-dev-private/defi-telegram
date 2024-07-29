import React, { useState } from 'react';
import axios from 'axios';

const TelegramBot = () => {
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    await axios.post('/api/send-message', { message });
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default TelegramBot;

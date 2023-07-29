import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([])
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    async function fetchMessages() {
      const messagesRes = await fetch('/api/list');
      const messageArr = await messagesRes.json();
      setMessages(messageArr);
    }
    fetchMessages();
  }, [])

  async function submitNewPost() {
    const smsRes = await fetch('/api/sms', {
      method: 'POST',
      body: JSON.stringify({
        From: '+15514273361',
        Body: newPost,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(smsRes)
    console.log('submit', newPost)
    setNewPost('');
  }

  if (!messages) { return <div>Loading...</div> }

  return (
    <div className="App">
{/*      <div>
        <input type="text" value={newPost} onChange={(e) => setNewPost(e.target.value)} />
        <button onClick={submitNewPost}>post</button>
      </div>*/}

      {messages.map(message => {
        const outgoingMessage = message.related_outgoing_messages?.find(x => !!x.body)?.body;
        const outgoingImage = message.related_outgoing_messages?.find(x => !!x.image)?.image;

        return (
          <div style={{padding:'20px'}}>
            <div style={{marginBottom:'10px'}}>
              <div><b>incoming</b></div>
              <div>{message.incoming_text}</div>
              <div><i>{message.created}</i></div>
            </div>
            <div>
              <div><b>outgoing</b></div>
              <div><span><i>{outgoingMessage}</i></span></div>
              {outgoingImage && <div><img src={outgoingImage} alt=''/></div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;

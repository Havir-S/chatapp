import { auth, db } from '@/firebase'
import { Avatar, IconButton } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState, useRef } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'

import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';

import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { getDoc, setDoc,  getDocs, collection, where, doc, orderBy, query, serverTimestamp, addDoc } from 'firebase/firestore'
import { InsertEmoticon } from '@mui/icons-material'
import Message from './Message'
import getRecipientEmail from '@/utils/getRecipientEmail'
import TimeAgo from 'timeago-react'

const ChatScreen = ({chat, messages}) => {
  const [user] = useAuthState(auth);
  const router = useRouter();

    /////////////////////////////////////////////SENDING MESSAGE
    /////MESSAGE INPUT
  const [input, setInput] = useState('')
  const endOfMessagesRef = useRef(null)

  const sendMessage = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, 'users', user.uid), {
      lastSeen: serverTimestamp()
    },
    { merge: true })

    await addDoc(collection(db, 'chats', router.query.id, 'messages'), {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    })

    setInput('');
    ScrollToBottom();
  }


  //////SCROLL TO BOTTOM OF MESSAGES
  const ScrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start', 
    });
  }



  /////////////////////////////////////////////Preparing and showing messages for the chat
  /////MESSAGE INPUT
  const docRef = doc(db, 'chats', router.query.id)
  const q = query(collection(docRef, 'messages'), orderBy('timestamp', 'asc'))
  /////Preparing a onSnapshot from hooks to listen for changes
  const [messagesSnapshot] = useCollection(q)

  /////Mapping through messages and creating DOM ELEMENTS
  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime()
          }}
         />
      ))
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ))
    }
  }


  

  // const q = query(collection(docRef, 'messages'), orderBy('timestamp', 'asc'))
  /////Preparing a onSnapshot from hooks to listen for changes
  // const [messagesSnapshot] = useCollection(q)

////WATCH FOR CHANGES IN STATUS OF THE TALKING FELLA
  const queryForRecipient = query(collection(db, 'users'), where('email', '==', getRecipientEmail(chat.users, user.email)))
  const [recipientSnapshot] = useCollection(queryForRecipient)

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  ////GET THE OTHER TALKING FELLA
  const recipientEmail = getRecipientEmail(chat.users, user)

  return (
    <Container>
        <Header>
          {recipient ? (
              <Avatar src={recipient?.photoURL} />
          ): (
            <Avatar>
              {recipientEmail[0]}
            </Avatar>
          )}
          

          <HeaderInformation>
            <h3>{recipientEmail}</h3>
            {recipientSnapshot ? (
              <p>Last active:  {''}
                {recipient?.lastSeen?.toDate() ? (
                  <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                ): (
                  'Unavailable'
                )}
              </p>
            ): (
              <p>Loading Last active...</p>
            )}
          </HeaderInformation>
          <HeaderIcons>
            <IconButton>
              <AttachFileIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </HeaderIcons>
        </Header>

        <MessageContainer>
          {showMessages()}
          <EndOfMessages ref={endOfMessagesRef} />
        </MessageContainer>

        <InputContainer>
          <InsertEmoticon />
          <Input value={input} onChange={e => setInput(e.target.value)} />
          <button disabled={!input} hidden type='submit' onClick={sendMessage}>Send Message</button>
          <MicIcon />
        </InputContainer>
    </Container>
  )
}

export default ChatScreen

const Container = styled.div`
    
`;

const Header = styled.div`
  display: flex;
    padding: 11px;
    position: sticky;
    background-color: white;
    z-index: 2;
    top: 0;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
    
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
      margin-bottom: 3px;
    }

    > p {
      font-size: 14px;
      color: gray;
    }
`;

const HeaderIcons = styled.div`
    
`;
const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height:90vh;
`;

const EndOfMessages = styled.div`
    
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 2;
`;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius:10px;
    background-color:whitesmoke;
    padding:20px;
    margin-left: 15px;
    margin-right: 15px;
`;
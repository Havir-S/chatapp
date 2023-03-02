import ChatScreen from '@/components/ChatScreen'
import Sidebar from '@/components/Sidebar'
import Head from 'next/head'
import React from 'react'
import styled from 'styled-components'

import {doc, where, getDoc, getDocs, collection, query, orderBy} from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import getRecipientEmail from '@/utils/getRecipientEmail'

const Chat = ({chat, messages}) => {
    const [user] = useAuthState(auth)
    // console.log(chat, messages);

  return (
    <Container>
        <Head>
            <title>Chat with {getRecipientEmail(chat.users, user)}</title>
        </Head>
        <Sidebar />
        <ChatContainer>
            <ChatScreen chat={chat} messages={messages} />
        </ChatContainer>
    </Container>
  )
}

export default Chat


//// PRE-FETCH THE CHAT AND MESSAGES
export async function getServerSideProps(context) {
    const docRef = doc(db, 'chats', context.query.id)

    const q = query(collection(docRef, "messages"), orderBy('timestamp', 'asc'));
    const messagesRes = await getDocs(q)

    const messages = messagesRes.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }))


    ////PREPARE THE CHAT
    const chatRes = await getDoc(docRef);
    const chat = {
        id: docRef.id,
        ...chatRes.data()
    }

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}

const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;
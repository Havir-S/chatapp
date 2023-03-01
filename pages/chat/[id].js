import ChatScreen from '@/components/ChatScreen'
import Sidebar from '@/components/Sidebar'
import Head from 'next/head'
import React from 'react'
import styled from 'styled-components'

import {doc, where, getDoc, collection, query} from 'firebase/firestore'
import { db } from '@/firebase'

const Chat = () => {
  return (
    <Container>
        <Head>
            <title>Chat</title>
        </Head>
        <Sidebar />
        <ChatContainer>
            <ChatScreen />
        </ChatContainer>
    </Container>
  )
}

export default Chat

//// GET CHATS
// export async function getServerSideProps(context) {
//     const ref = db.

// ////GET MESSAGES
//     return {
//         {props}
//     }
// }

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
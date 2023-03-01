import { Avatar } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import getRecipientEmail from '@/utils/getRecipientEmail'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase'
import { useCollection} from 'react-firebase-hooks/firestore';
import {doc, where, getDoc, collection, query} from 'firebase/firestore'
import { useRouter } from 'next/router';

const Chat = ({id, users}) => {
    const router = useRouter();
    const [user] = useAuthState(auth);
    // const [recipientSnapshot] = useCollection(getDoc((db, 'users'), where('email', '==', getRecipientEmail(users, user)))
    const [recipientSnapshot] = useCollection(query(collection(db, 'users'), where('email', '==', getRecipientEmail(users, user))))

    const enterChat = () => {
        router.push(`/chat/${id}`)
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(users, user);

  return (
    <Container onClick={enterChat}>
        {recipient ? (
            <UserAvatar src={recipient?.photoURL} />
        ) : (
            <UserAvatar />
        )}
        
        <p>{recipientEmail}</p>
    </Container>
  )
}

export default Chat

const Container = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    word-break: break-word;
    cursor: pointer;
    :hover {
        background-color: #e9eaeb;
    }
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`
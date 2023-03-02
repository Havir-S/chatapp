import { Avatar, Button, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect } from 'react'
import styled from 'styled-components';
import * as EmailValidator from 'email-validator';
import {signOut } from "firebase/auth";
import { auth, db } from '@/firebase'
import { addDoc, collection, deleteDoc, doc, onSnapshot, where, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat';

const Sidebar = () => {

    /// USER FROM SESSION
    const [user] = useAuthState(auth);

    /// USING THE HOOK WE CAN CREATE A SNAPSHOT TO LISTEN TO chat arrays
    const userChatRef = query(collection(db, 'chats'), where('users', 'array-contains', user.email))
    const [chatsSnapshot, loading] = useCollection(userChatRef)

    // useEffect(() => {
    //     console.log(chatsSnapshot)
    // }, [chatsSnapshot])


    /// CREATING NEW CHAT FROM USER INPUT
    const createChat = async () => {
        const newChat = prompt('Enter an email address for the user You want to chat with.');

        if (!newChat) return null;

        //// VALIDATE IF NEW CHAT ALREADY DOESN'T EXIST, IF IT'S AN EMAIL AND IF THE USER ISN'T CALLING HIMSELF
        if (EmailValidator.validate(newChat) && !chatAlreadyExists(newChat) && newChat !== user.email) {
            // We need to add the chat to the DB chats
            await addDoc(collection(db, 'chats'), {
                users: [user.email, newChat]
            })
        }


    }

    //// FROM THE CHATS SNAPSHOT CHECK IF THE USER + NEW CHATTER COMBO DOESN'T EXIST ALREADY
    const chatAlreadyExists = (recipientEmail) => 
       !!chatsSnapshot?.docs.find((chat) => chat.data().users.find(user => user === recipientEmail)?.length > 0)
    

  return (
    <Container>
        <Header>
            <UserAvatar src={user.photoURL} onClick={() => {auth.signOut()}} />
            <IconsContainer>
                <IconButton>
                    <ChatIcon />
                </IconButton>

                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </IconsContainer>
        </Header>


        <Search>
            <SearchIcon />
            <SearchInput placeholder='Search' />
        </Search>

        <SidebarButton onClick={createChat}>
            Star a new chat
        </SidebarButton>

        {/* chats */}
        {chatsSnapshot?.docs.map(chat => (
            <Chat key={chat.id} id={chat.id} users={chat.data().users} />
        ))}
    </Container>
  )
}

export default Sidebar;

const Container = styled.div`
    flex:.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }
`;



const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
`;

const SidebarButton = styled(Button)`
    width:100%;
    
    &&& {
        border-bottom: 1px solid whitesmoke;
        border-top: 1px solid whitesmoke;
    }
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover {
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div``;
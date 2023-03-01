import { Button } from '@mui/material'
import Head from 'next/head'
import React from 'react'
import styled from 'styled-components'
import { signInWithPopup, } from "firebase/auth";
import { auth, provider } from '@/firebase'
const Login = () => {

    const signIn = () => {
        signInWithPopup(auth, provider).catch(alert);
    }

  return (
    <Container>
        <Head>
            <title>Login to chatapp Krzysztof Szafran</title>
        </Head>

        <LoginContainer>
            <Logo 
                src='https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png'
            />
            <Button onClick={signIn} variant='outlined'>Sign in with Google</Button>
        </LoginContainer>
    </Container>
  )
}

export default Login

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: whitesmoke;
`;

const LoginContainer = styled.div`
    display: flex;
    padding: 100px;
    background-color: white;
    flex-direction: column;
    border-radius: 5px;
    box-shadow: 0px 4px 14px -3px rgba(0,0,0,.6);
    align-items: center;
    
`;

const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;
`;
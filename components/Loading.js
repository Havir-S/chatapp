import React from 'react'
import { Wave } from 'better-react-spinkit'


const Loading = () => {
  return (
    <center style={{display: 'grid', placeItems: 'center', alignContent:'center', height: '100vh'}}>
        <div>
            <img src='https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png' style={{marginBottom: 10}} alt='' height={200} />
        </div>
        <Wave size={100} color='#3CBC2B' />
    </center>
  )
}

export default Loading
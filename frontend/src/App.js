import React, {useState, useEffect} from 'react'
import './App.css'
import Header from './components/boxes/Header'
import UserInfo from './components/boxes/UserInfo'
import LogInBox from './components/boxes/LogInBox'
import OpenedThreadBox from './components/boxes/OpenedThreadBox'
import Messages from './components/holders/Messages'
import NewThreadBox from './components/boxes/NewThreadBox'
import Threads from './components/holders/Threads'
import Channels from './components/holders/Channels'
import OpenedChannels from './components/holders/OpenedChannels'
import Notification from './components/util/Notification'

import socket from './services/connect'

const App = () => {
  const [messages, setMessages] = useState([])
  const [openedThread, setOpenedThread] = useState(null)
  const [threads, setThreads] = useState([])
  const [openedChannel, setOpenedChannel] = useState(null)
  const [channels, setChannels] = useState([])

  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState({message: null, color: 'green'})

  const setToThreads = (data) => {
    setOpenedChannel(null)
    setOpenedThread(null)
    setThreads([])
    setMessages([])

    setOpenedChannel(data[0].parentId)
    //console.log(data)
    //console.log('here')
    if(data[0].text){
      setThreads(data)
    }
  }

  const setToMessages = (data) => {
    setOpenedThread(null)
    setMessages([])

    //console.log(data)
    const openedThread = threads.find(
      (thread) => thread.id===data[0].parentId)
    setOpenedThread(openedThread)
    //console.log(openedThread)
    //console.log('here 2')
    if(data[0].text){
      setMessages(data)
    }
  }

  const closeThreads = () => {
    setThreads([])
    setOpenedChannel(null)
    setOpenedThread(null)
    setMessages([])
  }

  const closeMessages = () => {
    setMessages([])
    setOpenedThread(null)
  }

  const setToUser = (user) => {
    setUser(user)
  }

  const showNotification = (message, color) =>{
    setNotification({message, color})
    setTimeout(() => {
      setNotification({message: null, color})
    }, 4000)
  }
  
  /*

  useEffect( () => {
    userHelper.login(['Aapooo', '22222222', ], user => setUser(user))
  },[])

  */

  useEffect(() => {
    if(user && !user.username){
      socket.emit('GETUSERDISPLAYINFO')

      socket.emit('GETCHANNELSDISPLAYINFO')
    }

  }, [user])

  useEffect(() => {
    //CONNECTION HANDLING
    socket.on('disconnect', () => {
      showNotification("Server disconnected", 'red')
    })

    //ERROR HANDLING
    socket.on('USERERROR', errorText => {
      showNotification(errorText, 'red')
    })

    socket.on('*',(event, data) => {
      console.log(`EVENT: ${event}`)
      console.log(data)
    })

    //USER LOGIN HANDLING
    socket.on('USERDISPLAYINFO', user => {
      document.getElementById('root').style.pointerEvents = 'auto'

      setUser(user)
    })

    socket.on('CHANNELSDISPLAYINFO', data => {
      document.getElementById('root').style.pointerEvents = 'auto'
      
      setChannels(data)
    })
  }, [])

  return (
    <div>
      <Header />
      <br></br>
      <Notification message={notification.message} color={notification.color}/>
      {!user ? 
      <LogInBox su={setToUser} />
      :
      <div className='row'>
        <div id='channelColumn'>
          {user ? <UserInfo user={user} /> : null}
          {openedChannel
          ?
          <div>
            <OpenedChannels 
            channels={channels}
            st={setToThreads}
            ct={closeThreads}
            openedChannel={openedChannel} 
            />
          </div>
          :
          <div>
            <Channels 
            channels={channels}
            st={setToThreads} 
            />
          </div>
          }
        </div>
        <div id='messageColumn'>
          {openedThread 
          ? 
          <div>
            <OpenedThreadBox 
            openedThread={openedThread}
            cm={closeMessages}
            />
            <Messages
            messages={messages}
            openedThread={openedThread} 
            />
            {/*<NewMessageBox />*/}
          </div>
          : 
          openedChannel 
          ?
          <div>
            <NewThreadBox
            openedChannel={openedChannel}
            st={setToThreads}
            />
            <Threads 
            threads={threads}
            sm={setToMessages} 
            />
          </div>
          :
          null
          }
        </div>
      </div>
      }
    </div>
  )
}

export default App;
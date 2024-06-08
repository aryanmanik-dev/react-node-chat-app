import React from 'react'
import { useNavigate } from "react-router-dom"

const ChatBody = ({ messages, typingStatus, lastMessageRef }) => {
    const navigate = useNavigate()
    console.log(messages);

    const handleLeaveChat = () => {
        localStorage.removeItem("userName")
        navigate("/")
        window.location.reload()
    }

    return (
        <>
            <header className='chat__mainHeader'>
                <p>Hangout with Colleagues</p>
                <button className='leaveChat__btn' onClick={handleLeaveChat}>LEAVE CHAT</button>
            </header>


            <div className='message__container'>
                {messages.map(message => (
                    message.name === localStorage.getItem("userName") ? (
                        <div className="message__chats" key={message.id}>
                            <p className='sender__name'>You</p>


                            <div className='message__sender'>
                                {message?.imageData ? (
                                    <div className=''>
                                        {message?.imageData.startsWith('data:image') ? (
                                            <img src={message?.imageData} alt="Image" style={{width:"270px"}} />
                                        ) : message?.imageData.startsWith('data:application/pdf') ? (
                                            <embed src={message?.imageData} type="application/pdf" width="100%" height="600px" />
                                        ) : (
                                            <div>Unsupported file format</div>
                                        )}
                                    </div>
                                ) : null}
                                <p>{message.text}</p>
                            </div>

                        </div>
                    ) : (
                        <div className="message__chats" key={message.id}>
                            <p>{message.name}</p>
                            <div className='message__recipient'>
                                {message?.imageData ? (
                                    <div className=''>
                                        {message?.imageData.startsWith('data:image') ? (
                                            <img src={message?.imageData} alt="Image" style={{width:"270px"}} />
                                        ) : message?.imageData.startsWith('data:application/pdf') ? (
                                            <embed src={message?.imageData} type="application/pdf" width="100%" height="600px" />
                                        ) : (
                                            <div>Unsupported file format</div>
                                        )}
                                    </div>
                                ) : null}
                                <p>{message.text}</p>
                            </div>

                        </div>
                    )
                ))}

                <div className='message__status'>
                    <p>{typingStatus}</p>
                </div>
                <div ref={lastMessageRef} />
            </div>
        </>
    )
}

export default ChatBody
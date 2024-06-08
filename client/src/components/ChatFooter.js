import React, { useRef, useState } from 'react'

const ChatFooter = ({ socket }) => {
    const [imageCapture, setImageCapture] = useState(null);
    const photoRef = useRef(null);

    const cameraRef = useRef()
    const [message, setMessage] = useState("")
    const handleTyping = () => socket.emit("typing", `${localStorage.getItem("userName")} is typing`)
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && localStorage.getItem("userName")) {
            const fileInput = document.getElementById("fileInput");
            const file = fileInput.files[0];

            if (file) {
                // If there's an image, send it along with the message
                sendImage((imageData) => {
                    socket.emit("message", {
                        text: message,
                        name: localStorage.getItem("userName"),
                        id: `${socket.id}${Math.random()}`,
                        socketID: socket.id,
                        imageData: imageData
                    });

                    fileInput.value = ""
                    setMessage("")
                });
            } else {
                // If there's no image, just send the message
                socket.emit("message", {
                    text: message,
                    name: localStorage.getItem("userName"),
                    id: `${socket.id}${Math.random()}`,
                    socketID: socket.id
                });
            }
        }
        setMessage("");
    };


    const sendImage = (callback) => {

        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];
        if (file.size > 2 * 1024 * 1024) {
            alert("File size exceeded. Please select an image smaller than 2 MB.");
            return;
        }
        const reader = new FileReader();

        reader.onload = function (event) {
            const imageData = event.target.result;
            callback(imageData);
            console.log(imageData);
        };
        reader.readAsDataURL(file);

    };

    const openCamera = async () => {
        try {
            cameraRef.current.style.display = "block";
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            cameraRef.current.srcObject = stream;
            const mediaStreamTrack = stream.getVideoTracks()[0];
            const imageCaptureInstance = new ImageCapture(mediaStreamTrack);
            setImageCapture(imageCaptureInstance);
            console.log('ImageCapture created:', imageCaptureInstance);
        } catch (error) {
            console.log('Error accessing camera:', error);
        }
    };

    const captureImage = async () => {
        try {
            if (!imageCapture) return;
            const blob = await imageCapture.takePhoto();
            const url = window.URL.createObjectURL(blob);
            photoRef.current.src = url;
            const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
            const filename = `captured_image_${timestamp}.png`;

            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = filename;
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);

            // Stop the video stream (close the camera)
            const stream = cameraRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            cameraRef.current.srcObject = null;
            cameraRef.current.style.display = "none";

        } catch (error) {
            console.log('Error taking photo:', error);
        }
    };



    return (
        <div className='chat__footer'>

            <form className='form' onSubmit={handleSendMessage}>

                <video

                    height={"200px"}
                    ref={cameraRef} autoPlay></video>
                <button
                    onClick={openCamera}
                    className='leaveChat__btn'>Open Camera</button>


                {cameraRef.current ? (
                    <>

                        <button className='leaveChat__btn' onClick={captureImage}>Capture</button>

                    </>

                ) : null}

                <input
                    type="file"
                    accept='image/* ,application/pdf'
                    id='fileInput'
                />
                <input
                    type="text"
                    placeholder='Write message'
                    className='message'
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleTyping}
                />
                <button className="sendBtn">SEND</button>
                <img style={{ display: "none" }} ref={photoRef} alt="Captured Image" />

            </form>
        </div>
    )
}

export default ChatFooter
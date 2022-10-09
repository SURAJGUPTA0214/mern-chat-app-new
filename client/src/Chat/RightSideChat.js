import { Avatar, Divider, Input, Form, Button, Menu, message } from 'antd';
import { 
	FileOutlined, 
	SendOutlined, 
	PaperClipOutlined, 
	SmileOutlined, 
	AudioMutedOutlined,
	UserOutlined,
	DeleteOutlined
} from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { parseInt } from 'lodash';
import { useForm } from 'antd/lib/form/Form';
import moment from "moment";
import Lottie from "react-lottie";
import typingGif from "../Assets/typing.json";

import { lastChart, sameChart } from './chatFunc';
import './chat.css';


const RightSideChat = ({ messages, handleSubmit, typings, isTyping})=>{

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: typingGif,
		rendererSettings: {
		  preserveAspectRatio: "xMidYMid slice",
		},
	  };

	// console.log("selectChat", selectChat.selectChat._id)

	const chatBodyRef = useRef();
	const form = useForm();


    useEffect(()=>{
        scrollToBottom();
		
    },[messages])

    const scrollToBottom = () => {
		chatBodyRef.current.scrollToBottom()
	}

    const chatContentHeader = name => (
		<div className="chat-content-header">
			<h4 className="mb-0">{name}</h4>
		</div>
	)

	const onFinish= async (values)=>{
		console.log("values", values)
		handleSubmit(values);
	}

	let senderId = JSON.parse(localStorage.getItem("userInfo"));
	senderId = senderId?._id

	const handleTyping = ()=>{
		typings();
	}

	

	// useEffect(()=>{
	// 	let senderId = JSON.parse(localStorage.getItem("userInfo"));
	// 	senderId = senderId?._id;
	// 	if(message?.[message?.length-1]?.sender._id !== senderId){
	// 		new Audio('https://chat-engine-assets.s3.amazonaws.com/click.mp3').play()
	// 	}
	// },[message])

    const chatContentBody = (props, id) => (
		<div className="chat-content-body">
			<Scrollbars ref={chatBodyRef} autoHide>
				{
					messages?.map((elm, i) => (
						<div 
							key={`msg-${id}-${i}`} 
							className={`msg ${elm.msgType === 'date'? 'datetime' : ''} ${elm.sender._id !== senderId ? 'msg-recipient' : elm.sender._id === senderId? 'msg-sent' : ''}`}
						>
							{console.log("messages", messages)}
							
							{
								(sameChart(messages, elm, i, senderId) || lastChart(messages, i, senderId) ) ?
								<div className="mr-2" style={{display:'flex', alignSelf:'center'}}>
									<div class="avatar-icon rounded-circle">
										{`${elm?.sender?.name}`.match(/\b([A-Za-z])/g)?.join('')}
									</div>
								</div>
								:
								null
							}
							{
								elm?.content?
								<div className={`bubble ${!elm?.avatar? 'ml-5' : ''}`}>
								
									<div className="bubble-wrapper" style={{marginLeft: !(sameChart(messages, elm, i, senderId) || lastChart(messages, i, senderId) ) && '35px'}}>
                                    <div alignItems="center" className="msg-file">
                                        {/* <FileOutlined className="font-size-md"/> */}
                                        <span className="ml-2 font-weight-semibold text-link pointer">

                                            <u>{elm?.content}</u>
                                        </span>
                                    </div>
								
									</div>
									{
										(sameChart(messages, elm, i, senderId) || lastChart(messages, i, senderId) ) && 
										<div className={elm.sender._id === senderId ? 'd-flex justify-content-end font-weight-semibold': 'font-weight-semibold' } style = {{color:'#000000a3'}}>{elm.sender.name.split(" ")[0]}, {moment(elm?.createdAt).format('LT')}</div>
									}
								</div>
								:
								null
							}
							{
								elm?.msgType === 'date'?
								<Divider>{elm?.time}</Divider>
								: 
								null
							}
						</div>
					))
				}
			</Scrollbars>
		</div>
	)

    const chatContentFooter = () => (
		<div className="chat-content-footer">
			<Form onFinish={onFinish} name="msgInput" className="w-100" >
				{isTyping && 
					<Lottie
						options={defaultOptions}
						height={30}
						width={50}
						style={{ marginBottom: 5, marginLeft: 15 }}
					/>
				}

				<Form.Item name="content" className="mb-0" >
					<Input 
					style={{borderRadius:'10px', lineHeight:'40px'}}
						autoComplete="off" 
						placeholder="Type a message..."
						suffix={
							<div className="d-flex align-items-center">
								
								<Button shape="circle" type="primary" size="small"  htmlType="submit">
									<SendOutlined />
								</Button>
							</div>
						}
						onChange = {()=>handleTyping()}
					/>
				</Form.Item>
			</Form>
		</div>
	)

    return(
    <>
       <div className="chat-content">
            {/* {chatContentHeader("bcd efg")} */}
            {chatContentBody([], 12)}
            {chatContentFooter()}
        </div>
    </>
    )
}

export default RightSideChat;

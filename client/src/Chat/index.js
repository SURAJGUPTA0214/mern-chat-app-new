import { useEffect, useState } from "react";
import axios from "axios";
import { Grid, MenuItem, MenuList, Tooltip } from "@material-ui/core";
import "./chat.css";
import { AiOutlineLogout } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import RightSideChat from "./RightSideChat";
import io from "socket.io-client";
import Toast from "../Component/Toast";

const ENDPOINT = "https://mern-chat-app-new.heroku.com/";
var socket, selectChatCompare;

const Chat = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState("");
  const [searchDataResult, setSearchDataResult] = useState([]);
  const [listingData, setListingData] = useState([]);
  const [loginUser, setLoginUser] = useState();
  const [selectChat, setSelectChat] = useState();
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [socketConnect, setSocketConnect] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setLoginUser(JSON.parse(localStorage.getItem("userInfo")));
    listingChat();
  }, [searchDataResult]);

  useEffect(() => {
    socket = io(ENDPOINT);
    let user = JSON.parse(localStorage.getItem("userInfo"));
    console.log("userhere", user);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnect(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    searchChat();
  }, [searchData]);

  const searchChat = async () => {
    const token = localStorage.getItem("chatAppToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const data = await axios.get(
      `http://localhost:1000/api/user?search=${searchData}`,
      config
    );
    console.log("searchdatas", data.data);
    setSearchDataResult(data?.data);
  };

  const handleClick = async (userId) => {
    const token = localStorage.getItem("chatAppToken");
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      "http://localhost:1000/api/chat",
      { userId },
      config
    );

    console.log("after click data", data);
  };

  const listingChat = async () => {
    const token = localStorage.getItem("chatAppToken");
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get("http://localhost:1000/api/chat", config);
    console.log("getting data", data);
    setListingData(data);
  };

  const getSenderName = (loginUser, users) => {
    return users[0]._id === loginUser._id ? users[1].name : users[0].name;
  };

  const handleLogout = () => {
    localStorage.removeItem("chatAppToken");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  useEffect(() => {
    getOldMessage();
    selectChatCompare = selectChat;
  }, [selectChat]);

  const getOldMessage = async () => {
    const token = localStorage.getItem("chatAppToken");
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:1000/api/message/${selectChat._id}`,
        config
      );
      setMessages(data);
      console.log("old data", data);
      socket.emit("joinChat", selectChat._id);
    } catch (error) {
      Toast("single", "error", "", "Something Wrong !");
    }
  };

  const handleSubmit = async (values) => {
    values.chatId = selectChat._id;
    console.log("values", values);
    const token = localStorage.getItem("chatAppToken");
    socket.emit("stop typing", selectChat._id);
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:1000/api/message",
        values,
        config
      );

      console.log("data", data);
      socket.emit("new message", data);
      setMessages([...messages, data]);
    } catch (error) {
      Toast("single", "error", "", "Something Wrong !");
    }
  };

  useEffect(() => {
    console.log("joint runnin brefor");

    socket.on("message recieved", (newMessageRecieved) => {
      console.log("newMessageRecieved", newMessageRecieved);
      if (
        !selectChatCompare ||
        selectChatCompare._id !== newMessageRecieved.chat._id
      ) {
        console.log("xxx");
      } else {
        setMessages([...messages, newMessageRecieved]);
        new Audio(
          "https://chat-engine-assets.s3.amazonaws.com/click.mp3"
        ).play();
      }
    });
  });

  const typings = () => {
    console.log("timer run here");

    if (!socketConnect) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      <Grid container className="containers">
        <Grid
          item
          xs={4}
          md={4}
          style={{ borderRight: "0.1px solid #80808024", padding: "15px" }}
        >
          <div style={{ padding: "15px 0px" }}>
            <div class="align-box-row">
              <div class="avatar-icon-wrapper avatar-icon-md">
                <span class="badge badge-circle badge-success"></span>
                <div class="avatar-icon rounded-circle">
                  {`${loginUser?.name}`.match(/\b([A-Za-z])/g)?.join("")}
                </div>
              </div>
              <div style={{ marginLeft: "10px" }}>
                <span class="d-block text-capitalize">
                  {loginUser?.name}
                  <small class="d-block text-black-50 text-initial ">
                    ({loginUser?.email})
                  </small>
                </span>
              </div>
              <div className="logoutDiv" onClick={() => handleLogout()}>
                <Tooltip title="Logout" placement="top" arrow>
                  <div>
                    <AiOutlineLogout />
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="searchbox">
            <input
              type="text"
              aria-label="search"
              className="searchInput"
              placeholder="🔍 name, email"
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
            />
          </div>
          <MenuList>
            {searchData?.length === 0 ? (
              <>
                {listingData?.length > 0 ? (
                  <>
                    <div className="searchbox">
                      <p>Your Friend List : </p>
                    </div>
                    {listingData?.map((item) => (
                      <MenuItem
                        onClick={() => setSelectChat(item)}
                        style={{
                          borderBottom: "0.1px solid #80808024",
                          borderRadius: "6px",
                          background:
                            selectChat === item ? "#dbf1ff" : "transparent",
                        }}
                      >
                        <div class="align-box-row">
                          <div class="avatar-icon-wrapper avatar-icon-md">
                            <span class="badge badge-circle badge-danger"></span>
                            <div class="avatar-icon rounded-circle">
                              {`${
                                item?.isGroupChat
                                  ? item?.chatName
                                  : getSenderName(loginUser, item?.users)
                              }`
                                .match(/\b([A-Za-z])/g)
                                ?.join("")}
                            </div>
                          </div>
                          <div style={{ marginLeft: "10px" }}>
                            <span class="d-block text-capitalize">
                              {item?.isGroupChat
                                ? item?.chatName
                                : getSenderName(loginUser, item?.users)}
                            </span>
                          </div>
                        </div>
                        {console.log("item", item)}
                      </MenuItem>
                    ))}
                  </>
                ) : (
                  <p>No Friend Found ! 😢</p>
                )}
              </>
            ) : (
              <>
                <div className="searchbox">
                  <p>Search Result : </p>
                </div>
                {searchDataResult?.length > 0 ? (
                  searchDataResult?.map((item) => (
                    <MenuItem
                      style={{ borderBottom: "0.1px solid #80808024" }}
                      onClick={() => handleClick(item?._id)}
                    >
                      <div class="align-box-row">
                        <div class="avatar-icon-wrapper avatar-icon-md">
                          <span class="badge badge-circle badge-danger"></span>
                          <div class="avatar-icon rounded-circle">
                            {`${item?.name}`.match(/\b([A-Za-z])/g)?.join("")}
                          </div>
                        </div>
                        <div style={{ marginLeft: "10px" }}>
                          <span class="d-block text-capitalize">
                            {item?.name}
                            <small class="d-block text-black-50 text-initial">
                              ({item?.email})
                            </small>
                          </span>
                        </div>
                      </div>
                    </MenuItem>
                  ))
                ) : (
                  <p>No Search Found ! 😢</p>
                )}
              </>
            )}
          </MenuList>
        </Grid>
        <Grid item xs={8} md={8}>
          <RightSideChat
            isTyping={isTyping}
            messages={messages}
            handleSubmit={(values) => handleSubmit(values)}
            typings={() => typings()}
          />
        </Grid>
      </Grid>
      <style>{`
           
            .MuiMenuItem-root {
                font-family:cursive !important;
            }
            `}</style>
    </>
  );
};
export default Chat;

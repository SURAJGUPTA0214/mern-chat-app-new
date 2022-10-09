
export const sameChart = (messages, elm, i, senderId)=>{
    console.log("userId", senderId)
    let data = i < messages?.length &&
        (messages[i+1]?.sender?._id !== elm?.sender._id || messages[i+1]?.sender?._id === undefined) && messages[i]?.sender?._id !== senderId
    return data;
}

export const lastChart = (messages, index, userId)=>{
    return(
        index === messages?.length - 1 &&
        messages[messages?.length - 1]?.sender?._id !== userId && messages[messages?.length - 1]?.sender?._id
    )
}
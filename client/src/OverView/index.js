import { Card, Col, Row } from "antd";
import {makeStyles} from "@material-ui/styles";
import {useNavigate} from 'react-router-dom';



const OverView = ()=>{
    const classes = useStyles();
    const navigate = useNavigate();

    return(
        <>
        <div className={classes.container} style={{ padding: "30px" }}>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Chat App" bordered={false} onClick = {()=> navigate('/chat') }>
                        Chat App with Socket.io & Node
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Voice Recognition, PDF" bordered={false} onClick = {()=> navigate('/text-voice')}>
                        Voice recognition & PDF, Image
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Payment Gateway" bordered={false}>
                        Razorpay, Stripe Intregration 
                    </Card>
                </Col>
            </Row>
        </div>
        
        </>
    )
}
export default OverView;


const useStyles = makeStyles((theme)=>({
    container:{
        width: '100vw',
        height: '100vh',
        background: '#343a40',
        '& .ant-card':{
        cursor:'pointer'

        }
    },

}))
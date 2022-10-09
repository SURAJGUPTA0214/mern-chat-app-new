
import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";
import {AiFillAudio, AiOutlineAudioMuted} from 'react-icons/ai';
import {MdRestartAlt} from 'react-icons/md';
import Lottie from "react-lottie";
import voiceGif from "../Assets/voice-waves.json";
// import Pdf from "react-to-pdf";
import { exportComponentAsPNG, exportComponentAsPDF } from 'react-component-export-image';


import './index.css'
import { Button } from 'antd';



const TextToVoice= ()=>{
  const ref = React.createRef();

    const { transcript, resetTranscript } = useSpeechRecognition();
    const [voiceStart, setVoiceStart] = useState(false);
    const { speak, voices } = useSpeechSynthesis();

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: voiceGif,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
      };

      useEffect(()=>{
          const cleanTimeout = setTimeout(() => {//note: remove setTimeout if not required
            setValue(transcript);
          }, 1500);
    
          return ()=>{
            clearTimeout(cleanTimeout);
          };
      },[transcript]);

      if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        alert("Browser does not support speech to text");
      }
    const [value, setValue] = useState('');

    return(
        <>
          <div className='audiobox'  ref={ref} > 
            <p className='headline'>Start Mike, Say Something...</p>
            <textarea
              style={{width:'100%'}}
              rows = {8}
              cols={32}
                value={value}
                onChange={(event) => setValue(event.target.value)}
            />
            
            <div className={`textIcon`} style={{display:'flex', bottom: value?.length > 0 ? '45px':'15px'}} >
              {!voiceStart ?  
                <>
                  <AiFillAudio  onClick={()=>{setVoiceStart(!voiceStart);  SpeechRecognition.startListening({ continuous: true }) } } />
                  {value?.length > 0 && <MdRestartAlt onClick={resetTranscript}/> }
                </>
                : 
                <>
                  <Lottie
                    options={defaultOptions}
                    height={28}
                    width={45}
                    style={{display: 'flex', justifyCntent: 'center'}}
                  />
                  <AiOutlineAudioMuted onClick={()=> { setVoiceStart(!voiceStart); SpeechRecognition.stopListening();} }/>
                </>
              }
            </div>
            {value?.length > 0 &&
              <div className='buttons-div'>
                <Button variant="primary" onClick={() =>{console.log("i run"); speak({ text: value, voice: voices[4] }); } } >Listen Voice</Button>
              
                {/* <Pdf targetRef={ref} filename="code-example.pdf">
                  {({toPdf}) => (
                    <Button  danger variant="contained" onClick={toPdf}>Download in PDF</Button>
                  )}
                </Pdf> */}

<Button  danger variant="contained" onClick={() => exportComponentAsPDF(ref, {w:300, h:400, x:0, y:0, unit:'px', orientation:'p', pdfFormat:'a0 - a10'})}>Download in PDF</Button>

                
                <Button variant="contained" onClick={() => exportComponentAsPNG(ref)} >Download in IMAGE</Button>
              </div>
            }

           
            
         
        </div>
        </>

    )
}
export default TextToVoice;
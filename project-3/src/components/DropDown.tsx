import React, { useRef, useState, useEffect } from "react";
import { defaultButton } from "../app/styles";
import Translate from "./Translate";
import { text } from "stream/consumers";
import HelpFeaturesPlayer from "./audioPlayers/dropdown/helpFeaturesPlayer";
import ZoomInPlayer from "./audioPlayers/dropdown/zoomInPlayer";
import TextSpeechPlayer from "./audioPlayers/dropdown/textSpeechPlayer";
import TranslatePlayer from "./audioPlayers/dropdown/translatePlayer";

interface DropDownProps {
  /**
   * Function to handle font size change.
   * @param {string} newFontSize - The new font size value.
   */
  onFontSizeChange: (newFontSize: string) => void;
  /**
   * Function to activate or deactivate text-to-speech.
   * @param {boolean} activateSpeech - Flag to activate or deactivate text-to-speech.
   */
  textToSpeech: (activateSpeech: boolean) => void;
}

const fontSizes = ["16px", "20px", "25px", "30px"]; // Array of font sizes
const originalFontSize = "16px";

/**
 * DropDown component for selecting font size and activating text-to-speech.
 * @param {DropDownProps} props - Props for the DropDown component.
 * @returns {JSX.Element} - Rendered DropDown component.
 */
function DropDown({ onFontSizeChange, textToSpeech }: DropDownProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [fontSizeIndex, setFontSizeIndex] = useState(0);
  const [entrance, setEntrance] = useState(false);
  const [textSpeechCtrl, setTextSpeechCtrl] = useState(false);
  const [audio, setAudio] = useState<string>("null");



  const dropDownRef = useRef<HTMLDivElement>(null);

  const handleDropDownFocus = (state: boolean) => {
    setOpen(!state);
  };

  const handleZoom = () => {
    setFontSizeIndex((prevIndex) => (prevIndex + 1) % fontSizes.length);
    onFontSizeChange(fontSizes[fontSizeIndex]);
  };
  const handleSpeech = () => {
    const newSpeechCtrl = !textSpeechCtrl;
    setTextSpeechCtrl(newSpeechCtrl);
    textToSpeech(newSpeechCtrl);
  };

  useEffect(() => {
    if (!entrance) {
      setEntrance(true);
    }
  }, [entrance]);


  return (
    <div>
      <div ref={dropDownRef}>
        <button onClick={(e) => { handleDropDownFocus(open); setAudio("HelpFeatures"); }}>
          {" "}
          Help Features{" "}
        </button>

        {audio === "HelpFeatures" && textSpeechCtrl && <HelpFeaturesPlayer autoPlay={true} />}

        {open && (
          <ul className="items-center">
            <li className="flex items-center space-x-4" onMouseOver={() => (setAudio("ZoomIn"))}>
              <div className={defaultButton} onClick={() => { handleZoom() }}>
                Zoom In
              </div>
            </li>
            {audio === "ZoomIn" && textSpeechCtrl && <ZoomInPlayer autoPlay={true} />}

            <li onMouseOver={() => (setAudio("TextSpeech"))}>
              <button className={defaultButton} onClick={() => { handleSpeech() }}>
                Text-To-Speech
              </button>
              {textSpeechCtrl && <TextSpeechPlayer autoPlay={true} />}

              {
                textSpeechCtrl
                && (
                  <div className="popup">
                    <p>Voice Enabled</p>
                  </div>
                )
              }
            </li>

            <li onMouseOver={() => (setAudio("Translation"))}><Translate></Translate>
              {audio === "Translation" && textSpeechCtrl && <TranslatePlayer autoPlay={true} />}

            </li>
          </ul>
        )}
      </div>

    </div>
  );
}

export default DropDown;

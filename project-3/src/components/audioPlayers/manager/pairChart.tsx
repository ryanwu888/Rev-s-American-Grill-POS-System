
import audio from "../../audio/manager/pairChart.mp3";
import React, { createRef } from 'react';

/**
 * Plays audio for the pairChart
 * @param {boolean} autoPlay -The check if Voice is active
 * @author Ethan Wenthe
 */

interface AudioPlayerProps {
    autoPlay: boolean;
}
const pairChart: React.FC<AudioPlayerProps> = ({ autoPlay }) => {
    const audioRef = createRef<HTMLAudioElement>();

    return (
        <audio ref={audioRef} controls autoPlay={autoPlay} style={{ position: 'absolute', left: '-9999px' }} >
            <source src={audio} type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio >
    );
};
export default pairChart;


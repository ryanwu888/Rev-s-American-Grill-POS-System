
import ViewFood from "../../audio/manager/addFoodItems.mp3";
import React, { createRef } from 'react';

/**
 * Plays audio for the addFoodItems
 * @param {boolean} autoPlay -The check if Voice is active
 * @author Ethan Wenthe
 */

interface AudioPlayerProps {
    autoPlay: boolean;
}
const addInventPlayer: React.FC<AudioPlayerProps> = ({ autoPlay }) => {
    const audioRef = createRef<HTMLAudioElement>();

    return (
        <audio ref={audioRef} controls autoPlay={autoPlay} style={{ position: 'absolute', left: '-9999px' }} >
            <source src={ViewFood} type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio >
    );
};
export default addInventPlayer;


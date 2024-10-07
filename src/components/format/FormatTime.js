export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} phút`;
}

export default formatTime;
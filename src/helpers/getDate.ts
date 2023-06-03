
export const convertFromMsToMinutes = (time: number) => {
    return Math.floor((time / 1000 / 60) % 60)
}

export const convertFromMsToSeconds = (time: number) => {
    return Math.floor(time / 1000)
}


export const formatTime = (time: number) => {
    let seconds: number = Math.floor((time / 1000) % 60);
    let minutes: number = Math.floor((time / 1000 / 60) % 60);

    // @ts-ignore
    if (minutes < 10) minutes = '0' + minutes;
    // @ts-ignore
    if (seconds < 10) seconds = '0' + seconds;

    return minutes + ':' + seconds
}


export function declOfNum(number: number, words: string[]) {
    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? Math.abs(number) % 10 : 5]];
}
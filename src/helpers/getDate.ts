
export const convertFromMsToMinutes = (time: number) => {
    return Math.floor((time / 1000 / 60) % 60)
}


export const millisToMinutesAndSeconds = (time: number) => {
    const minutes = Number(Math.floor(time / 60000))
    const seconds = Number(((time % 60000) / 1000).toFixed(0));

    let resultString = ''

    // Если только минуты
    if (minutes > 0 && seconds === 0) {
        resultString += minutes + ' мин'
    }

    // Если есть и минуты и секнуды
    if (minutes > 0 && seconds > 0) {
        resultString += minutes + ':' + seconds + ' мин'
    }

    if (minutes === 0 && seconds > 0) {
        resultString += seconds + ' сек'
    }

    return resultString
}

export const convertFromMsToSeconds = (time: number) => {
    return Math.floor(time / 1000)
}

export const convertFromMinutesToMs = (time: number) => {
    return Math.floor(time * 1000 * 60)
}

export const convertFromSecondsToMs = (time: number) => {
    return Math.floor(time * 1000)
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
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'
import { App } from 'antd'
import { useRef, useState } from 'react'

export const useFfmpeg = () => {
    const [loaded, setLoaded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const ffmpegRef = useRef(new FFmpeg())
    const { message } = App.useApp()

    const load = async () => {
        setIsLoading(true)
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd'
        const ffmpeg = ffmpegRef.current
        if (!ffmpeg.loaded) {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
            })
            message.success('FFmpeg loaded')
        }
        setLoaded(true)
        setIsLoading(false)
    }
    return {
        load,
        loaded,
        isLoading,
        ref: ffmpegRef
    }
}
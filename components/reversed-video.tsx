import { useFfmpeg } from "@/hooks/ffmpeg"
import { fetchFile } from "@ffmpeg/util"
import { useQuery } from "@tanstack/react-query"
import { App, Skeleton } from "antd"
import { FC, Ref, useEffect, useId, useRef } from "react"
import { nanoid } from 'nanoid'

export interface IRerverseVideoProps {
    ref: Ref<HTMLVideoElement>
    src: string
}

export const ReversedVideo: FC<IRerverseVideoProps> = props => {
    const ffmpeg = useFfmpeg()
    const { message } = App.useApp()
    const videoRef = useRef<HTMLVideoElement>(null)

    const { data: originVideoBlob } = useQuery(['origin', props.src], async () => {
        return await fetch(props.src).then(res => {
            message.success({ content: '视频下载完成' })
            return res.blob();
        })
    }, { enabled: Boolean(props.src) })

    const { data: reversedVideoBlob } = useQuery(['reversed', props.src], async () => {
        const close = message.loading({ content: '正在倒放视频', duration: 0 })
        try {
            const instance = ffmpeg.ref.current;
            instance.on('log', console.log)
            await ffmpeg.load();

            const name = nanoid();
            const originVideoName = `${name}.mp4`;
            if (!originVideoBlob) {
                throw new Error('origin video blob is undefined')
            }
            instance.writeFile(
                originVideoName,
                new Uint8Array(
                    await originVideoBlob!.arrayBuffer()
                )
            );

            const reversedVideoName = `${name}.reversed.mp4`;
            await instance.exec([
                '-i', originVideoName,
                '-vf', 'reverse',
                '-af', 'areverse',
                reversedVideoName
            ]);
            const reversedVideoBuffer = await instance.readFile(reversedVideoName) as ArrayBuffer;
            const data = new Uint8Array(reversedVideoBuffer);

            return data;
        } finally {
            close()
        }
    }, {
        enabled: Boolean(originVideoBlob),
    })

    useEffect(() => {
        if (reversedVideoBlob && videoRef.current) {
            videoRef.current.src = URL.createObjectURL(new Blob([reversedVideoBlob]))
        }
    }, [reversedVideoBlob, videoRef.current])

    return reversedVideoBlob
        ? <video className='aspect-video w-full rounded' controls ref={videoRef} />
        : <Skeleton active />;
}

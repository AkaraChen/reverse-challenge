import dynamic from "next/dynamic"
import { FC, useEffect, useRef } from "react"

export interface IVideoProps {
    src: string,
    isReversed: boolean,
}

const ReversedVideo = dynamic(
    () => import('@/components/reversed-video').then(mod => mod.ReversedVideo),
    { ssr: false }
)

export const Video: FC<IVideoProps> = props => {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (props.src) {
            if (!props.isReversed) {
                if (videoRef.current) {
                    videoRef.current.src = props.src
                }
            }
        }
    }, [props.src, props.isReversed, videoRef.current])
    return props.isReversed
        ? <ReversedVideo src={props.src} ref={videoRef} />
        : <video className='aspect-video w-full rounded' controls ref={videoRef} />
}

import { useVideoInfo } from "@/requests/bilibili"
import { FC } from "react"
import Image from 'next/image'
import { Skeleton, Space } from 'antd'

export interface ICardProps {
    bv: string
}

export const VideoCard: FC<ICardProps> = props => {
    const { data } = useVideoInfo(props.bv)
    return <Space className="rounded overflow-hidden" direction="vertical">
        {data?.pic
            ? <Image src={data?.pic} width={240} height={135} alt={data.title} className="rounded" />
            : <Skeleton.Image className="rounded" active />
        }
        <h2 className="text-sm font-normal">{data?.title}</h2>
    </Space>
}

import { NextApiRequest, NextApiResponse } from "next"

export type Param = {
    bv: string,
    cid: string
}

export type Data = {
    url: string
}

async function getVideo({ bv, cid }: { bv: string, cid: string }) {
    const baseUrl = 'https://api.bilibili.com/x/player/playurl'
    const params = [
        ['bvid', bv],
        ['cid', cid],
    ]
    const url = new URL(baseUrl)
    const searchParams = new URLSearchParams(params)
    url.search = searchParams.toString()
    const response = await fetch(url)
    const data = await response.json()
    const { data: videoInfo } = data
    const { durl } = videoInfo
    const video = durl[0]
    const videoUrl = video?.backup_url ? video?.backup_url[0] : video.url;
    return videoUrl
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { bv, cid } = req.query as Param
    getVideo({ bv, cid }).then(data => {
        res.json({
            url: data
        })
    })
}

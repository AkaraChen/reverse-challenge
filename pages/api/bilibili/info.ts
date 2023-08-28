import type { NextApiRequest, NextApiResponse } from 'next'

type Param = {
  // TODO: support AV
  bv: string
}

type Video = {
  cid: string,
  index: number,
  name: string,
}

export type Data = {
  title: string,
  videos: Video[],
  pic: string
}

async function getVideoInfo({ bv }: { bv: string }) {
  const baseUrl = 'https://api.bilibili.com/x/web-interface/view'
  const params = [
    ['bvid', bv],
  ]
  const url = new URL(baseUrl)
  const searchParams = new URLSearchParams(params)
  url.search = searchParams.toString()
  const response = await fetch(url)
  const data = await response.json()
  return data
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { bv } = req.query as Param
  const { data: videoInfo } = await getVideoInfo({ bv })
  const { title, pic, pages } = videoInfo
  res.json({
    title,
    videos: pages.map((page: any) => {
      return {
        cid: page.cid,
        index: page.page,
        name: page.part,
      }
    }),
    pic,
  })
}

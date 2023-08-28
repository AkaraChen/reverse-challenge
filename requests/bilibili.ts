import { useQuery } from '@tanstack/react-query'
import { Data as InfoData } from '@/pages/api/bilibili/info'
import { Data as VideoData } from '@/pages/api/bilibili/video'
import { useEffect } from 'react'
import { App } from 'antd'

export const useVideoInfo = (bv: string | undefined) => {
    const query = useQuery<InfoData>(
        ['bilibili', 'videoInfo', bv],
        async () => {
            const baseUrl = '/api/bilibili/info'
            const params = [
                ['bv', bv!],
            ]
            const url = new URL(baseUrl, window.location.origin)
            const searchParams = new URLSearchParams(params)
            url.search = searchParams.toString()
            return fetch(url).then(res => res.json())
        },
        {
            enabled: Boolean(bv),
        }
    )
    return query
}

export const useVideoInfoWithMessage = (bv: string | undefined) => {
  const { data, isError, isFetched } = useVideoInfo(bv)
  const { message } = App.useApp()

  useEffect(() => {
    if (isFetched && data) {
      message.success('视频信息获取成功')
    }
  }, [isFetched])

  useEffect(() => {
    if (isError) {
      message.error('视频信息获取失败')
    }
  }, [isError])

  return { data, isError, isFetched }
}

export const useVideoSource = (bv: string | undefined, cid: string | undefined) => {
    return useQuery<VideoData>(
        ['bilibili', 'videoSource', bv, cid],
        async () => {
            const baseUrl = '/api/bilibili/video'
            const params = [
                ['bv', bv!],
                ['cid', cid!],
            ]
            const url = new URL(baseUrl, window.location.origin)
            const searchParams = new URLSearchParams(params)
            url.search = searchParams.toString()
            return fetch(url).then(res => res.json())
        },
        {
            enabled: Boolean(bv && cid)
        }
    )
}

import { VideoCard } from '@/components/video-card';
import { useVideoInfoWithMessage, useVideoSource } from '@/requests/bilibili';
import { Button, Layout, Input, Form, Select, Switch, App } from 'antd'
import dynamic from 'next/dynamic';
import { useState } from 'react';

const { Header, Footer, Content } = Layout;

const Video = dynamic(() => import('@/components/video').then(mod => mod.Video))

export default function Home() {
  const [bv, setBv] = useState<string | undefined>(undefined)
  const handleBvSubmit = (values: { bv: string }) => setBv(values['bv'])

  const [enabled, setEnabled] = useState<boolean>(true)
  const [selectedVideo, setSelectedVideo] = useState<number>(0)
  const { data } = useVideoInfoWithMessage(bv)

  const { data: videoSource } = useVideoSource(bv, data?.videos[selectedVideo]?.cid)

  return <div className='min-h-screen flex flex-col'>
    <Header className='flex items-center'>
      <h1 className="text-white text-lg font-medium">倒放挑战</h1>
    </Header>
    <Content className='px-12 py-6 flex h-full'>
      <div className='w-72 flex flex-col gap-4'>
        <Form name='视频信息' onFinish={handleBvSubmit}>
          <Form.Item label='BV号' required name={'bv'}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>获取</Button>
          </Form.Item>
        </Form>

        {
          bv && data && <>
            <VideoCard bv={bv} />
            <Form name='视频调整'>
              <Form.Item label='分P'>
                <Select value={selectedVideo} onChange={index => setSelectedVideo(index)} options={data.videos.map(video => {
                  return {
                    label: video.name,
                    value: video.index - 1
                  }
                })} />
              </Form.Item>
              <Form.Item label='画质'>
                <Select />
              </Form.Item>
              <Form.Item label='倒放开关'>
                <Switch defaultChecked onChange={setEnabled} />
              </Form.Item>
            </Form>
          </>
        }
      </div>
      <div className='w-full px-12'>
        <div className='w-full h-full'>
          { videoSource?.url && <Video src={videoSource.url} isReversed={enabled} /> }
        </div>
      </div>
    </Content>
    <Footer>
      <p>
        CopyRight © {new Date().getFullYear()}{' '}
      </p>
    </Footer>
  </div>
}

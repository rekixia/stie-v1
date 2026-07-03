import { Hono } from 'hono'

type Bindings = {
  ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Bindings }>()

// 순수 정적 사이트: 모든 요청을 Cloudflare Pages 정적 에셋으로 위임합니다.
// (clean URL 처리, 404 등은 Pages Assets 레이어가 자동으로 처리)
app.get('*', (c) => {
  return c.env.ASSETS.fetch(c.req.raw)
})

export default app

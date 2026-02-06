'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// 1. Supabase 연결 설정
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DBTestPage() {
  const [scores, setScores] = useState<any[]>([])
  const [name, setName] = useState('')

  // 2. DB에서 데이터 불러오기 함수
  async function fetchScores() {
    const { data } = await supabase.from('typing_scores').select('*').order('created_at', { ascending: false })
    if (data) setScores(data)
  }

  // 3. DB에 데이터 저장하기 함수
  async function saveScore() {
    if (!name) return alert('이름을 입력하세요')
    await supabase.from('typing_scores').insert([{ user_name: name, speed: 450, accuracy: 99 }])
    setName('')
    fetchScores() // 저장 후 다시 불러오기
  }

  useEffect(() => { fetchScores() }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>DB 연결 테스트 페이지</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="이름 입력" 
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button onClick={saveScore} style={{ padding: '8px 16px' }}>결과 저장 테스트</button>
      </div>

      <h3>실시간 랭킹 기록 (DB 데이터)</h3>
      <ul>
        {scores.map((s) => (
          <li key={s.id}>
            <strong>{s.user_name}</strong>: {s.speed}타 / {s.accuracy}% ({new Date(s.created_at).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  )
}

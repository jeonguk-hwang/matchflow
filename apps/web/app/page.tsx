import Navbar from '@/components/navbar'

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="opacity-80">매치 변경 알림, 최근 이벤트, 공지 등을 여기에 배치할 예정.</p>
        </div>
      </div>
    </>
  )
}
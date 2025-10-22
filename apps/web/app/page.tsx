import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="container section">
        {/* Hero */}
        <section className="hero">
          <div className="hero-bg" />
          <div className="hero-stripe" />
          <div className="relative p-8 sm:p-12 lg:p-16">
            <h1 className="brand text-4xl sm:text-6xl leading-[1.05]">
              BLACK COMBAT <span className="brand-accent">VIBE</span> 운영툴
            </h1>
            <p className="mt-4 max-w-2xl text-zinc-300">
              매치카드 변경과 알림을 한 곳에서. 운영의 스피드를 한 단계 끌어올리세요.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/matches" className="btn-accent">매치 보기</a>
              <a href="#latest" className="btn">최근 업데이트</a>
            </div>
            <div className="hero-ring" />
          </div>
        </section>

        {/* Featured panels */}
        <section id="latest" className="grid md:grid-cols-3 gap-4 sm:gap-6 mt-6">
          <div className="card">
            <h3 className="brand text-lg">이벤트</h3>
            <p className="opacity-80 text-sm">다가오는 넘버링/대회 정보를 요약해서 보여줄 예정</p>
          </div>
          <div className="card">
            <h3 className="brand text-lg">공지</h3>
            <p className="opacity-80 text-sm">운영자 공지, 규정 변경, 도핑/룰 안내 등</p>
          </div>
          <div className="card">
            <h3 className="brand text-lg">스토어</h3>
            <p className="opacity-80 text-sm">후드/트렁크 등 굿즈를 연동(향후)</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

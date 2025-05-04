import ChatWidget from "../components/ChatWidget/ChatWidget"
import Footer from "../components/Footer/Footer"
import Header from "../components/Header/Header"
import Welcome from "../components/Welcome/Welcome"

const Main = () => {

  return (
    <>


      <Header />
    
      <main className="page-content">
      <Welcome />

      </main>
      <Footer />
    </>
  )
}

export default Main
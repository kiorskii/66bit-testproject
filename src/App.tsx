import Header from "./components/Header/Header"
import List from "./components/List/List"
import Navigation from "./components/Navigation/Navigation"
import Search from "./components/Search/Search"
import { ThemeProvider } from "./contexts/ThemeContext"

function App() {

  return (
    <ThemeProvider>
      <Header />
      <Navigation />
      <Search />
      <List />
    </ThemeProvider>
  )
}

export default App

import Header from "./components/Header/Header"
import List from "./components/List/List"
import Navigation from "./components/Navigation/Navigation"
import Search from "./components/Search/Search"
import { EmployeeProvider } from "./contexts/EmployeeContext"
import { ThemeProvider } from "./contexts/ThemeContext"

function App() {

  return (
    <EmployeeProvider>
      <ThemeProvider>
        <Header />
        <Navigation />
        <Search />
        <List />
      </ThemeProvider>
    </EmployeeProvider>
  )
}

export default App

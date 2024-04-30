import Header from "../components/Header/Header"
import List from "../components/List/List"
import Navigation from "../components/Navigation/Navigation"
import Search from "../components/Search/Search"
import { EmployeeProvider } from "../contexts/EmployeeContext"

const Main = () => {
  return (
    <EmployeeProvider>
      <Header />
      <Navigation />
      <Search />
      <List />
    </EmployeeProvider>
  )
}

export default Main
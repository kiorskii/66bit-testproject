import { useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import Navigation from '../components/Navigation/Navigation';
import Person from '../components/Person/Person';
import { useEffect, useState } from 'react';
import { fetchEmployee } from '../services/api';
import { convertData } from '../services/convert';
import Footer from '../components/Footer/Footer';

const Card = () => {

  const { id } = useParams();

  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    async function fetchEmployeeDetails(id) {
      if (isNaN(id)) {
        return;
      }
      const data = await fetchEmployee(id);

      convertData(data);

      setEmployee(data);
    }
    fetchEmployeeDetails(id);
  }, [id]);


  return (
    <>
      <Header />
      <main className="page-content">
      <Navigation employeeName={employee?.name} />
      <Person employee={employee} />
      </main>
      <Footer />
    </>
  );
}

export default Card;

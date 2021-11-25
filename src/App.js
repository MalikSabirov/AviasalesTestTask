import React, {useState, useEffect} from 'react'
import './App.scss';
import NumberOfTransfers from './components/NumberOfTransfers/NumberOfTransfers';
import Tabs from './components/Tabs/Tabs';
import Ticket from './components/Ticket/Ticket';
import iLogo from './images/logo.svg'
import normalizeData from './functions/normalizeData';

const fetchingSearchId = (setMethod) => {
  fetch("https://front-test.beta.aviasales.ru/search")
  .then((response) => response.json())
  .then((data) => data.searchId)
  .then((searchId) => {
    setMethod(searchId);
  });
}

const fetchingTickets = (searchParam, setMethod) => {
  if(searchParam !== undefined) {
    fetch(
      `https://front-test.beta.aviasales.ru/tickets?searchId=${searchParam}`
    )
      .then((response) => response.json())
      .then((data) => setMethod(data.tickets));
  }
}

const sortByPrice = (arr) => {
  return arr.slice().sort((a, b) => a.price - b.price )
}

const sortByDuration = (arr) => {
  return arr.sort( (a, b) => {
    let averageA = (a.flightTo["durationInMinutes"] + a.flightFrom["durationInMinutes"]) / 2
    let averageB = (b.flightTo["durationInMinutes"] + b.flightFrom["durationInMinutes"]) / 2

    return averageA - averageB;
  })
}

function App() {
  const [searchId, setSearchId] = useState()
  const [tickets, setTickets] = useState([])

  const [tabsData, setTabsData] = useState([
    {
      id: 1,
      title: "Самый дешевый",
      isActive: true
    },
    {
      id: 2,
      title: "Самый быстрый",
      isActive: false
    },
  ])

  const [numberOfTransfer, setNumberOfTransfer] = useState([
    {
      id: 1,
      title: "Все",
      isChecked: true
    },
    {
      id: 2,
      title: "Без пересадок",
      isChecked: false
    },
    {
      id: 3,
      title: "1 пересадка",
      isChecked: false
    },
    {
      id: 4,
      title: "2 пересадки",
      isChecked: false
    },
    {
      id: 5,
      title: "3 пересадки",
      isChecked: false
    },
  ])

  const [activeTab, setActiveTab] = useState(0)
  const [showedTickets, setShowedTickets] = useState(5)

  useEffect(() => {
    fetchingSearchId(setSearchId)
  }, []);

  useEffect(() => {
    fetchingTickets(searchId, setTickets)
  }, [searchId])

  const normalizedTickets = normalizeData(tickets)

  const changeTab = (num) => {
    setActiveTab(num - 1)

    setTabsData(prevState => {
      return prevState.map(item => {
        if ( item.id === num && !item.isActive ) {
          item.isActive = !item.isActive
        }
        if ( item.id  !== num && item.isActive) {
          item.isActive = !item.isActive
        }
        return item
      })
    })
  }

  const handleChange = (id) => {
    setNumberOfTransfer(prevState => {
      return prevState.map(item => {
        if (item.id === id && !item.isChecked) {
          return {
            ...item,
            isChecked: !item.isChecked
          }
        }
        if (item.id !== id && item.isChecked === true) {
          return {
            ...item,
            isChecked: false
          }
        }
        return item
      })
    })
  }

  let sortedByPrice = sortByPrice(normalizedTickets)
  let sortedByDuration = sortByDuration(normalizedTickets)

  const tabs = [sortedByPrice, sortedByDuration]
  tabs[activeTab].length = showedTickets;

  return (
    <div className="app">
      <img className="logo" src={iLogo} alt="logo"/>
      <div className="container">
        <NumberOfTransfers 
          numberOfTransfers={numberOfTransfer}
          handleChange={handleChange}
        />

        <div className="right-container">
          <Tabs 
          changeTab={changeTab}
          tabsData={tabsData}
          />

          {tabs[activeTab].map( (ticket, id) => {
            return(
              <Ticket 
                price={ticket.price}
                imgUrl={ticket.imgUrl}
                key={id}

                flightTo={ticket.flightTo}
                flightFrom={ticket.flightFrom}
              />
            )
          })}

        <button 
          className="button"
          onClick={() => setShowedTickets(prev => prev + 5)}
        >
          Показать еще 5 билетов!
        </button>
       </div>
      </div>
    </div>
  );
}

export default App;

import React, {useState, useEffect, useMemo, useCallback} from 'react'
import './App.scss';
import NumberOfTransfers from './components/NumberOfTransfers/NumberOfTransfers';
import Tabs from './components/Tabs/Tabs';
import Ticket from './components/Ticket/Ticket';
import iLogo from './images/logo.svg'
import normalizeData from './functions/normalizeData';
import {sortByPrice, sortByDuration, filterByStops} from './functions/sortAndFilter'
import {fetchingSearchId, fetchingTickets} from './functions/fetching'

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
      isChecked: false,
      stops: 0
    },
    {
      id: 3,
      title: "1 пересадка",
      isChecked: false,
      stops: 1
    },
    {
      id: 4,
      title: "2 пересадки",
      isChecked: false,
      stops: 2
    },
    {
      id: 5,
      title: "3 пересадки",
      isChecked: false,
      stops: 3
    },
  ])

  const [activeTab, setActiveTab] = useState(1)
  const [showedTickets, setShowedTickets] = useState(5)

  useEffect(() => {
    fetchingSearchId().then( (searchId) => setSearchId(searchId))
  }, []);

  useEffect(() => {
    if(searchId) {
      fetchingTickets(searchId).then(tickets => setTickets(tickets))
    }
  }, [searchId])

  const normalizedTickets = normalizeData(tickets)

  const changeTab = (id) => {
    setActiveTab(id)

    setTabsData(prevState => {
      return prevState.map(item => {
        if (item.id === id && !item.isActive) {
          return {
            ...item,
            isActive: !item.isActive
          }
        } else {
          return {
            ...item,
            isActive: !item.isActive
          }
        }
      })
    })
  }

  // dobavit' chtoby pustoi ne byl 
  // let isAllNotChecked = numberOfTransfer.every(item => item.isChecked === false)
  // // let amountOfChecks = numberOfTransfer.reduce((acc, current) => current.isChecked ? acc + 1 : acc, 0)
  // let amountOfChecks = numberOfTransfer.reduce((acc, current) => current.isChecked ? acc + 1 : acc, 0)
  // useEffect(() => {
  //   console.log(isAllNotChecked)
  // }, [isAllNotChecked])


  const handleChange = useCallback(
    (id) => {
      setNumberOfTransfer(prevState => {
        return prevState.map(item => {
          if (item.id === id) {
            return {
              ...item,
              isChecked: !item.isChecked
            }
          }
          return item
        })
      })
    },
    [],
  )

  const filteredByStops = filterByStops(normalizedTickets, numberOfTransfer)
  const sortedByPrice = sortByPrice(filteredByStops)
  const sortedByDuration = sortByDuration(filteredByStops)

  // useMemo || useCallBack
  const currentTickets = useMemo(() => {
    console.log("current tickets render")
    if (activeTab === 1) {
      return sortedByPrice.slice(0, showedTickets)
    } else if (activeTab === 2) {
      return sortedByDuration.slice(0, showedTickets)
    } else {
      console.error("current Tickets undefined")
      return []
    }
  }, [filteredByStops])

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

          {currentTickets.map( (ticket, id) => {
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

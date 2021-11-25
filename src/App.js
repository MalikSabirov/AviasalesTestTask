import React, {useState, useEffect} from 'react'
import './App.scss';
import NumberOfTransfers from './components/NumberOfTransfers/NumberOfTransfers';
import Tabs from './components/Tabs/Tabs';
import Ticket from './components/Ticket/Ticket';
import iLogo from './images/logo.svg'

const getFormatedTime = (time) => {
  if (time < 10) {
    return "0" + time
  } else {
    return time
  }
}

const getArrivalTime = (startDate, duration) => {
  let startHour = startDate.getHours()
  let startMinutes = startDate.getMinutes()

  let startInMinutes = startHour * 60 + startMinutes
  let arrivalInMinutes = startInMinutes + duration
  let arrivalInHours = Math.trunc(arrivalInMinutes / 60)
  
  let arrivalHours = arrivalInHours;
  let arrivalMinutes = arrivalInMinutes % 60

  for (let i = 0; arrivalHours > 24; i++) {
    arrivalHours -= 24
  }

  arrivalHours = getFormatedTime(arrivalHours)
  arrivalMinutes = getFormatedTime(arrivalMinutes)

  return `${arrivalHours}:${arrivalMinutes}`
}

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

const TicketComponent = (ticket, id) => {
  const flightTo = ticket.segments[0]
  const flightFrom = ticket.segments[1]

  const imgUrl = `https://pics.avs.io/99/36/${ticket.carrier}.png`

  const durationToHours = Math.trunc(flightTo.duration / 60)
  const durationToMinutes = flightTo.duration % 60
  const durationTo = `${durationToHours}ч ${durationToMinutes}м`

  const flightToTime = new Date(flightTo.date)
  const flightFromTime = new Date(flightFrom.date)
  const flightToArrivalTime = getArrivalTime(flightToTime, flightTo.duration)
  const flightFromArrivalTime = getArrivalTime(flightFromTime, flightFrom.duration)

  const formattedToStartTime = `${ getFormatedTime( flightToTime.getHours() ) }:${ getFormatedTime( flightToTime.getMinutes() ) }`
  const formattedFromStartTime = `${ getFormatedTime( flightFromTime.getHours() ) }:${ getFormatedTime( flightFromTime.getMinutes() ) }`

  const flightTimeThere = `${formattedToStartTime} - ${flightToArrivalTime}`
  const flightTimeBack = `${formattedFromStartTime} - ${flightFromArrivalTime}`

  const durationFromInHours = Math.trunc(flightFrom.duration / 60)
  const durationFromInMinutes = flightFrom.duration % 60
  const durationFrom = `${durationFromInHours}ч ${durationFromInMinutes}м`

  const flightToStops = flightTo.stops
  const flightFromStops = flightFrom.stops

  return (
    <Ticket 
      price={ticket.price} 
      imgUrl={imgUrl}
      key={id}

      originTo={flightTo.origin}
      destinationTo={flightTo.destination}
      durationTo={durationTo}
      flightTimeThere={flightTimeThere}
      flightToStops={flightToStops.join(', ')}

      originFrom={flightFrom.origin}
      destinationFrom={flightFrom.destination}
      durationFrom={durationFrom}
      flightTimeBack={flightTimeBack}
      flightFromStops={flightFromStops.join(', ')}
    />
  )
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

  let priceSortedTickets = tickets.slice().sort((a, b) => a.price - b.price)
  let durationSortedTickets = tickets.slice().sort((a, b) => a.segments[0].duration - b.segments[0].duration)

  const filterStopsAmount = (sortedTickets) => {
    for (let i = 0; i < numberOfTransfer.length; i++) {
      if(numberOfTransfer[i].isChecked) {
        switch (i) {
          case 1:
            return sortedTickets.filter(ticket => {
              return (
                ticket.segments[0].stops.length === 0 && ticket.segments[1].stops.length === 0
              )
            })
          case 2:
            return sortedTickets.filter(ticket => {
              return (
                ticket.segments[0].stops.length === 1 && ticket.segments[1].stops.length === 1
              )
            })
          case 3:
            return sortedTickets.filter(ticket => {
              return (
                ticket.segments[0].stops.length === 2 && ticket.segments[1].stops.length === 2
              )
            })
          case 4:
            return sortedTickets.filter(ticket => {
              return (
                ticket.segments[0].stops.length === 3 && ticket.segments[1].stops.length === 3
              )
            })
          default: 
            return sortedTickets
        }
      }
    }
  }

  priceSortedTickets = filterStopsAmount(priceSortedTickets)
  durationSortedTickets = filterStopsAmount(durationSortedTickets)

  const tabs = [priceSortedTickets, durationSortedTickets]
  const [activeTab, setActiveTab] = useState(0)
  const [showedTickets, setShowedTickets] = useState(5)

  useEffect(() => {
    fetchingSearchId(setSearchId)
  }, []);

  useEffect(() => {
    fetchingTickets(searchId, setTickets)
  }, [searchId])

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

  tabs[activeTab].length = showedTickets;

  const ticketsComponent = tabs[activeTab].map( (ticket, id) => TicketComponent(ticket, id) )

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

        {ticketsComponent}

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

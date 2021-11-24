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

function App() {
  const [searchID, setSearchID] = useState()
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

  // priceSortedTickets = priceSortedTickets.filter(item => item.segments[0].stops.length === 0 && item.segments[1].stops.length === 0)
  // priceSortedTickets = priceSortedTickets.filter(item => item.segments[0].stops.length === 1)
  // priceSortedTickets = priceSortedTickets.filter(item => item.segments[0].stops.length === 0 && item.segments[0].stops.length === 0)

  const filterStopsAmount = (sortedTickets) => {
    // let filteredTickets = []
    // for (let i = 1; i < numberOfTransfer.length; i++) {
    //   if (numberOfTransfer[i].isChecked) {
    //     if(numberOfTransfer[i].isChecked === 0) {
    //       filteredTickets = sortedTickets.slice().filter(item => item.segments[0].stops.length === 0 && item.segments[1].stops.length === 0)
    //     }
    //   }
    // }
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
    fetch("https://front-test.beta.aviasales.ru/search")
      .then(response => response.json())
      .then(data => {
        setSearchID(data.searchId)
    })
  }, [])
  // получить searchID

  useEffect(() => {
    fetch(`https://front-test.beta.aviasales.ru/tickets?searchId=${searchID}`)
      .then(response => response.json())
      .then(data => setTickets(data.tickets))
  }, [searchID])
  //zapros ticketы

  const changeTab = (num) => {
    let index = num - 1
    setActiveTab(index)

    setTabsData(prevState => {
      return prevState.map(item => {
        if ( (item.id - 1) === index && !item.isActive ) {
          item.isActive = !item.isActive
        }
        if ( (item.id - 1) !== index && item.isActive) {
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

  const ticketsComponents = tabs[activeTab].map( (ticket, id) => {
    const flightTo = ticket.segments[0]
    const flightFrom = ticket.segments[1]

    const durationToHours = Math.trunc(flightTo.duration / 60)
    const durationToMinutes = flightTo.duration % 60

    const flightToTime = new Date(flightTo.date)
    const flightFromTime = new Date(flightFrom.date)
    const flightToArrivalTime = getArrivalTime(flightToTime, flightTo.duration)
    const flightFromArrivalTime = getArrivalTime(flightFromTime, flightFrom.duration)
    // massive otfarmatirovannyh dannyh doljen vozvrashat'

    const formattedToStartTime = `${ getFormatedTime( flightToTime.getHours() ) }:${ getFormatedTime( flightToTime.getMinutes() ) }`
    const formattedFromStartTime = `${ getFormatedTime( flightFromTime.getHours() ) }:${ getFormatedTime( flightFromTime.getMinutes() ) }`

    const durationFromInHours = Math.trunc(flightFrom.duration / 60)
    const durationFromInMinutes = flightFrom.duration % 60

    return (
      <Ticket 
        price={ticket.price} 
        imgUrl={`https://pics.avs.io/99/36/${ticket.carrier}.png`}
        key={id}

        originTo={flightTo.origin}
        destinationTo={flightTo.destination}
        durationTo={`${durationToHours}ч ${durationToMinutes}м`}
        toStartTime={formattedToStartTime}
        toFinishTime={flightToArrivalTime}
        flightToStops={flightTo.stops.join(', ')}
        flightToStopsAmount={flightTo.stops.length}

        originFrom={flightFrom.origin}
        destinationFrom={flightFrom.destination}
        durationFrom={`${durationFromInHours}ч ${durationFromInMinutes}м`}
        fromStartTime={formattedFromStartTime}
        fromFinishTime={flightFromArrivalTime}
        flightFromStops={flightFrom.stops.join(', ')}
        flightFromStopsAmount={flightFrom.stops.length}
      />
    )
  })

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

        {ticketsComponents}

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

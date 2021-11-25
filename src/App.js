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

const getStopsText = (stops) => {
  if (stops < 0) {
    return ""
  } else if (stops === 0) {
    return "Без пересадок"
  } else if (stops === 1) {
    return "1 пересадка"
  } else if (stops >= 2 && stops <= 4) {
    return `${stops} пересадки`
  } else {
    return `${stops} пересадок`
  }
}

const normalizeData = (data) => {
  let result = data.slice().map( item => {
    const flightTo = item.segments[0]
    const flightFrom = item.segments[1]

    const durationToHours = Math.trunc(flightTo.duration / 60)
    const durationToMinutes = flightTo.duration % 60

    const durationFromInHours = Math.trunc(flightFrom.duration / 60)
    const durationFromInMinutes = flightFrom.duration % 60

    const flightToTime = new Date(flightTo.date)
    const flightToArrivalTime = getArrivalTime(flightToTime, flightTo.duration)
    const flightFromTime = new Date(flightFrom.date)
    const flightFromArrivalTime = getArrivalTime(flightFromTime, flightFrom.duration)

    const formattedToStartTime = `${ getFormatedTime( flightToTime.getHours() ) }:${ getFormatedTime( flightToTime.getMinutes() ) }`
    const formattedFromStartTime = `${ getFormatedTime( flightFromTime.getHours() ) }:${ getFormatedTime( flightFromTime.getMinutes() ) }`

    return {
      price: item.price,
      carrier: item.carrier,
      imgUrl: `https://pics.avs.io/99/36/${item.carrier}.png`,

      flightTo: {
        direction: `${flightTo.origin} - ${flightTo.destination}`,
        duration: `${durationToHours}ч ${durationToMinutes}м`,
        time: `${formattedToStartTime} - ${flightToArrivalTime}`,
        stops: flightTo.stops.join(", "),
        stopsNum: getStopsText(flightTo.stops.length)
      },

      flightFrom: {
        direction: `${flightFrom.origin} - ${flightFrom.destination}`,
        duration: `${durationFromInHours}ч ${durationFromInMinutes}м`,
        time: `${formattedFromStartTime} - ${flightFromArrivalTime}`,
        stops: flightFrom.stops.join(", "),
        stopsNum: getStopsText(flightFrom.stops.length)
      }
    }
  })

  return result
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

          {normalizedTickets.map( (ticket, id) => {
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

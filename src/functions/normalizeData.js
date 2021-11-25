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
        durationInMinutes: flightTo.duration,
        time: `${formattedToStartTime} - ${flightToArrivalTime}`,
        stops: flightTo.stops.join(", "),
        stopsNum: getStopsText(flightTo.stops.length)
      },

      flightFrom: {
        direction: `${flightFrom.origin} - ${flightFrom.destination}`,
        duration: `${durationFromInHours}ч ${durationFromInMinutes}м`,
        durationInMinutes: flightFrom.duration,
        time: `${formattedFromStartTime} - ${flightFromArrivalTime}`,
        stops: flightFrom.stops.join(", "),
        stopsNum: getStopsText(flightFrom.stops.length)
      }
    }
  })

  return result
}

export default normalizeData


export const sortByPrice = (arr) => {
  return arr.slice().sort((a, b) => a.price - b.price )
}

export const sortByDuration = (arr) => {
  return arr.sort( (a, b) => {
    let averageA = (a.flightTo["durationInMinutes"] + a.flightFrom["durationInMinutes"]) / 2
    let averageB = (b.flightTo["durationInMinutes"] + b.flightFrom["durationInMinutes"]) / 2

    return averageA - averageB;
  })
}

export const filterByStops = (arr, stopsArr) => {
  let tempArr = []

  for (let i = 0; i < stopsArr.length; i++) {

    if (stopsArr[i].isChecked) {
      if (i === 0) {
        tempArr = [...arr]
      } else {
        let stopsNum = stopsArr[i].stops

        for (let i = 0; i < arr.length; i++) {
          if( (arr[i].flightTo.stopsNum === stopsNum || 
              arr[i].flightFrom.stopsNum === stopsNum) &&
              !tempArr.includes(arr[i])
            ) {
            tempArr.push(arr[i])
          }
        }
      }
    }
  }

  return tempArr
}

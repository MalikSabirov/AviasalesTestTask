export const fetchingSearchId = () => {
  return fetch("https://front-test.beta.aviasales.ru/search")
    .then((response) => response.json())
    .then((data) => data.searchId)
}

export const fetchingTickets = (searchParam) => {
  return fetch(
    `https://front-test.beta.aviasales.ru/tickets?searchId=${searchParam}`
  )
    .then((response) => response.json())
    .then((data) => data.tickets);
}

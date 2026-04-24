export type City = {
  name: string
  country: string
  lng: number
  lat: number
}

// A curated list of European cities for autocomplete + target-city search.
// Coordinates are [lng, lat].
export const CITIES: City[] = [
  { name: "Tallinn", country: "Estonia", lng: 24.7536, lat: 59.437 },
  { name: "Tartu", country: "Estonia", lng: 26.7251, lat: 58.3776 },
  { name: "Pärnu", country: "Estonia", lng: 24.4971, lat: 58.3859 },
  { name: "Riga", country: "Latvia", lng: 24.1052, lat: 56.9496 },
  { name: "Daugavpils", country: "Latvia", lng: 26.5337, lat: 55.8714 },
  { name: "Liepāja", country: "Latvia", lng: 21.0108, lat: 56.5047 },
  { name: "Vilnius", country: "Lithuania", lng: 25.2797, lat: 54.6872 },
  { name: "Kaunas", country: "Lithuania", lng: 23.9036, lat: 54.8985 },
  { name: "Klaipėda", country: "Lithuania", lng: 21.1443, lat: 55.7033 },
  { name: "Helsinki", country: "Finland", lng: 24.9384, lat: 60.1699 },
  { name: "Stockholm", country: "Sweden", lng: 18.0686, lat: 59.3293 },
  { name: "Oslo", country: "Norway", lng: 10.7522, lat: 59.9139 },
  { name: "Copenhagen", country: "Denmark", lng: 12.5683, lat: 55.6761 },
  { name: "Warsaw", country: "Poland", lng: 21.0122, lat: 52.2297 },
  { name: "Kraków", country: "Poland", lng: 19.945, lat: 50.0647 },
  { name: "Gdańsk", country: "Poland", lng: 18.6466, lat: 54.352 },
  { name: "Berlin", country: "Germany", lng: 13.405, lat: 52.52 },
  { name: "Hamburg", country: "Germany", lng: 9.9937, lat: 53.5511 },
  { name: "Munich", country: "Germany", lng: 11.582, lat: 48.1351 },
  { name: "Frankfurt", country: "Germany", lng: 8.6821, lat: 50.1109 },
  { name: "Prague", country: "Czechia", lng: 14.4378, lat: 50.0755 },
  { name: "Vienna", country: "Austria", lng: 16.3738, lat: 48.2082 },
  { name: "Bratislava", country: "Slovakia", lng: 17.1077, lat: 48.1486 },
  { name: "Budapest", country: "Hungary", lng: 19.0402, lat: 47.4979 },
  { name: "Amsterdam", country: "Netherlands", lng: 4.9041, lat: 52.3676 },
  { name: "Brussels", country: "Belgium", lng: 4.3517, lat: 50.8503 },
  { name: "Paris", country: "France", lng: 2.3522, lat: 48.8566 },
  { name: "Lyon", country: "France", lng: 4.8357, lat: 45.764 },
  { name: "London", country: "United Kingdom", lng: -0.1276, lat: 51.5074 },
  { name: "Manchester", country: "United Kingdom", lng: -2.2426, lat: 53.4808 },
  { name: "Edinburgh", country: "United Kingdom", lng: -3.1883, lat: 55.9533 },
  { name: "Dublin", country: "Ireland", lng: -6.2603, lat: 53.3498 },
  { name: "Madrid", country: "Spain", lng: -3.7038, lat: 40.4168 },
  { name: "Barcelona", country: "Spain", lng: 2.1734, lat: 41.3851 },
  { name: "Lisbon", country: "Portugal", lng: -9.1393, lat: 38.7223 },
  { name: "Rome", country: "Italy", lng: 12.4964, lat: 41.9028 },
  { name: "Milan", country: "Italy", lng: 9.19, lat: 45.4642 },
  { name: "Zurich", country: "Switzerland", lng: 8.5417, lat: 47.3769 },
  { name: "Athens", country: "Greece", lng: 23.7275, lat: 37.9838 },
  { name: "Bucharest", country: "Romania", lng: 26.1025, lat: 44.4268 },
  { name: "Sofia", country: "Bulgaria", lng: 23.3219, lat: 42.6977 },
  { name: "Belgrade", country: "Serbia", lng: 20.4573, lat: 44.7866 },
  { name: "Zagreb", country: "Croatia", lng: 15.9819, lat: 45.815 },
  { name: "Ljubljana", country: "Slovenia", lng: 14.5058, lat: 46.0569 },
  { name: "Kyiv", country: "Ukraine", lng: 30.5234, lat: 50.4501 },
  { name: "Lviv", country: "Ukraine", lng: 24.0297, lat: 49.8397 },
  { name: "Minsk", country: "Belarus", lng: 27.5615, lat: 53.9045 },
  { name: "Saint Petersburg", country: "Russia", lng: 30.3351, lat: 59.9343 },
  { name: "Moscow", country: "Russia", lng: 37.6173, lat: 55.7558 },
  { name: "Istanbul", country: "Türkiye", lng: 28.9784, lat: 41.0082 },
  { name: "New York", country: "United States", lng: -74.006, lat: 40.7128 },
  { name: "Boston", country: "United States", lng: -71.0589, lat: 42.3601 },
  { name: "Washington, D.C.", country: "United States", lng: -77.0369, lat: 38.9072 },
  { name: "Chicago", country: "United States", lng: -87.6298, lat: 41.8781 },
  { name: "Toronto", country: "Canada", lng: -79.3832, lat: 43.6532 },
]

// Haversine great-circle distance in kilometers.
export function haversineKm(a: [number, number], b: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const [lng1, lat1] = a
  const [lng2, lat2] = b
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

"use server";
/* export async function fetchFromExternalAPI(params) {
1. Validate inputs & credentials
2. Build request (URL, headers, body)
3. Make HTTP request
4. Check HTTP response
5. Parse response
6. Validate API response
7. Extract needed data
8. Transform to your types
9. Return
 }
*/

import { API_ENDPOINTS, GEOCODING_API_BASE_URL } from "@/config/constants";
import { Address } from "../types";

// 1. Create a server action that takes in an address as a string and returns an Address as a promise
export async function practiceGeocodeAddress(
  address: string
): Promise<Address> {
  // 2. Get the api key from your .env.local file, then verify that it exists. if it doesnt, throw an error
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) throw new Error("There is an error with API Key");

  // 3a. Build the api url using the constants you specified in the constants file
  const baseUrl = `${GEOCODING_API_BASE_URL}${API_ENDPOINTS.GEOCODE}`;

  // 3b. take the address you got as a parameter and encode the url
  const encodedAddress = encodeURIComponent(address);

  // 3c. then combine all those pieces to make the url
  const url = `${baseUrl}?address=${encodedAddress}&key=${apiKey}`;

  // 4. make the fetch request to google geocoding api (think. what is the default method for a fetch request and how does that affect what we write?)
  const response = await fetch(url);

  // 5. Check if the http request was successful (response.ok)
  if (!response.ok) throw new Error("HTTP Status Error!");

  // 6. Parse the json response
  const data = await response.json();

  // 7. Validate the API response status
  if (data.status === "ZERO_RESULTS") {
    throw new Error("Address does not exist!");
  } else if (data.status === "INVALID_REQUEST") {
    throw new Error("No address was provided");
  } else if (data.status === "REQUEST_DENIED") {
    throw new Error("Your API Key is invalid or doesn't have permission!");
  } else if (data.status !== "OK") {
    // You can't just do a regular else statement here because that will also include the status "OK", which is what you dont want. so, instead you have to just say if the status is not ok. cuz then that applies to all other status codes that arent ok or the ones that you specified above
    throw new Error("Failed to geocode address");
  }

  // 8. Extract the first result from the response
  const geoCode = data.results[0];

  // 9. Return formatted Address
  return {
    formatted: geoCode.formatted_address,
    coordinates: {
      lat: geoCode.geometry.location.lat,
      lng: geoCode.geometry.location.lng,
    },
  };
}

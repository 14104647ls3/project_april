import { NextApiRequest, NextApiResponse } from 'next';
import gameIdsData from "../../../public/games.json"

async function fetchData(app_id) {
  // API for app detail: http://store.steampowered.com/api/appdetails?appids={APP_ID}
  try {
    const response = await fetch("http://store.steampowered.com/api/appdetails?appids=" + app_id);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export default async function loadGames() {
  let rtnData = []
  for (let id in gameIdsData.game_ids) {
    const data = await parseData(gameIdsData.game_ids[id])
    // console.log(data)
    rtnData.push(data)
  }
  return rtnData
}

export async function parseData(app_id) {
  // Parse image, title and desc by id
  // Output format in { id , image , title , description}
  try {
    const jsonData = await fetchData(app_id)

    // Extracting data
    const headerImage = jsonData[app_id].data.header_image;
    const name = jsonData[app_id].data.name;
    const detailedDescription = jsonData[app_id].data.detailed_description;
    const isFree = jsonData[app_id].data.is_free;
    let priceOverview = "Free"
    let offerPrice = ""
    if (!isFree) {
      priceOverview = jsonData[app_id].data.price_overview.final_formatted.replace(" ", ""); // Assuming the price overview is the second option in the packages
      let num = priceOverview.split("$")
      offerPrice = num[0]+"$"+Math.ceil(parseInt(num[num.length - 1])*0.8)
    }

    return { id: app_id, image: headerImage, title: name, description: detailedDescription, price: priceOverview, offer: offerPrice }
  } catch (error) {
    console.error('Error processing data:', error)
  }
}

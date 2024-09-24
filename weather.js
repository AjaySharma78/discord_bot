import config from "./config.js";

async function display(latitude, longitude) {
  try {
    const API_KEY = config.openweatherKey;
    const news = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=17&appid=${API_KEY}&units=metric`
    );
    const daily_result = await news.json();

  return { daily_result };
  } catch (error) {
    console.log("Error fetching weather data:", error);
  }
}

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function formatDate(item) {
  const unixTime = item.dt * 1000;
  const tim = new Date(unixTime);
  const month = tim.getUTCMonth();
  const dat = tim.getUTCDate();
  const day = tim.getUTCDay();

  return {
    day: days[day],
    date: dat,
    month: months[month]
  };
}

function formatDates(items) {
  return items.map(formatDate);
}



export { display, formatDates, formatDate };
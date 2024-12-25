const apikey = import.meta.env.VITE_HOLIDAY_APIKEY;

export const fetchHolidays = async () => {
    try {
        const currentYear = new Date().getFullYear();
        const response = await fetch(`https://holidayapi.com/v1/holidays?pretty&key=${apikey}&country=ID&year=${currentYear}`);
        const data = await response.json();
        return data.holidays
        // console.log(data.holidays)
    } catch (err) {
        console.error("Error Fetching Holidays:", err)
    }
}
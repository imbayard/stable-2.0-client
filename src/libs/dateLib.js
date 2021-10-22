/********************************
the FORMAT DATE method

takes in a date (js timestamp) --> returns "MM/DD/YYYY"
********************************/
export function formatDate(date){
    const newDate = new Date(date).toLocaleString("en-US", { timeZone: 'EST'});
    const dateArr = newDate.split('/');
    const year = dateArr[2].substr(0,4);
    const month = dateArr[0];
    const day = dateArr[1];
    return (month + "/" + day + "/" + year);
}

/********************************
the SET FILTER BY method

takes in a range as a string (either: week, month, year, alltime)
outputs a filter object indicating the start month, date, year of the filter start date and filter end date

Here is an example output object:
    {
        start: {
            'month': x,
            'date': x,
            'year': x
        },
        end: {
            'month': x,
            'date': x,
            'year': x
        }
    }
********************************/
export function setFilterBy(range){
    const today = new Date();
    const end = today.getTime();
    let start = 0;
    if(range === 'month'){
      start = end - 2419200000;
    } else if (range === 'week'){
      start = end - 604800000;
    } else if (range === 'year'){
      start = end - 31449600000;
    } else if (range === 'alltime'){
      start = 0;
    }
    return {
        'start': start,
        'end': end
    }
}

/********************************
the FILTER BY method

takes in the checkIn to filter and the filter object
returns true if the checkIn falls in the inclusive range of the filter object, false otherwise
********************************/
export function filterCheckIns(checkIn, filter){
    const checkInDate = checkIn.dateCreated;
    if (checkInDate >= filter.start && checkInDate <= filter.end){
      return true;
    } else {
      return false;
    }
  }
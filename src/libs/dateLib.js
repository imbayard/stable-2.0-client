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
    let month = today.getMonth() + 1;
    let date = today.getDate();
    let year = today.getFullYear();
    const end = {
      'month': month,
      'date': date,
      'year': year
    };
    if(range === 'month'){
      month = month - 1;
    } else if (range === 'week'){
      date = date - 7;
    } else if (range === 'year'){
      year = year - 1;
    } else if (range === 'alltime'){
      year = 0;
    }
    return {
        'start': {
          'month': month,
          'date': date,
          'year': year
        },
        'end': end
    }
}

/********************************
the FILTER BY method

takes in the checkIn to filter and the filter object
returns true if the checkIn falls in the inclusive range of the filter object, false otherwise
********************************/
export function filterCheckIns(checkIn, filter){
    const checkInDate = new Date(checkIn.dateCreated);
    const ciDateObject = {
      'month': checkInDate.getMonth() + 1,
      'date': checkInDate.getDate(),
      'year': checkInDate.getFullYear()
    }

    if(ciDateObject.year < filter.start.year || ciDateObject.year > filter.end.year){
      return false;
    }
    if(ciDateObject.year > filter.start.year && ciDateObject.year < filter.end.year){
      return true;
    }
    if(ciDateObject.year === filter.start.year && ciDateObject.year < filter.end.year){
      if(ciDateObject.month < filter.start.month){
        return false;
      }
      if(ciDateObject.month > filter.start.month){
        return true;
      }
      if(ciDateObject.month === filter.start.month){
        if(ciDateObject.date < filter.start.date){
          return false;
        }
        if(ciDateObject.date >= filter.start.date){
          return true;
        }
      }
    }
    if(ciDateObject.year > filter.start.year && ciDateObject.year === filter.end.year){
      if(ciDateObject.month > filter.end.month){
        return false;
      }
      if(ciDateObject.month < filter.end.month){
        return true;
      }
      if(ciDateObject.month === filter.end.month){
        if(ciDateObject.date > filter.end.date){
          return false;
        }
        if(ciDateObject.date <= filter.end.date){
          return true;
        }
      }
    }
    if(ciDateObject.year === filter.start.year && ciDateObject.year === filter.end.year){
      if(ciDateObject.month < filter.start.month || ciDateObject.month > filter.end.month){
        return false;
      }
      if(ciDateObject.month > filter.start.month && ciDateObject.month < filter.end.month){
        return true;
      }
      if(ciDateObject.month === filter.start.month && ciDateObject.month < filter.end.month){
        if(ciDateObject.date < filter.start.date){
          return false;
        }
        if(ciDateObject.date >= filter.start.date){
          return true;
        }
      }
      if(ciDateObject.month > filter.start.month && ciDateObject.month === filter.end.month){
        if(ciDateObject.date > filter.end.date){
          return false;
        }
        if(ciDateObject.date <= filter.end.date){
          return true;
        }
      }
      if(ciDateObject.month === filter.start.month && ciDateObject.month === filter.end.month){
        if(ciDateObject.date < filter.start.date || ciDateObject.date > filter.end.date){
          return false;
        }
        if(ciDateObject.date >= filter.start.date && ciDateObject.date <= filter.end.date){
          return true;
        }
      }
    }
  }
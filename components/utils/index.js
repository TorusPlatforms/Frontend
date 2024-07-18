export function findTimeAgo(timestamp) {
    const now = new Date();

  
    const date = new Date(timestamp)

    const timeDifference = now - date;

    const secondsDifference = Math.floor(timeDifference / 1000);

    let agoMessage;

    if (secondsDifference <= 0) {
      agoMessage = "Just Now";
    } else if (secondsDifference < 60) {
      agoMessage = `${secondsDifference} second${secondsDifference === 1 ? "" : "s"} ago`;
    } else if (secondsDifference < 3600) {
      const minutes = Math.floor(secondsDifference / 60);
      agoMessage = `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    } else if (secondsDifference < 86400) {
      const hours = Math.floor(secondsDifference / 3600);
      agoMessage = `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else {
      const days = Math.floor(secondsDifference / 86400);
      agoMessage = `${days} day${days === 1 ? "" : "s"} ago`;
    }
  
    return agoMessage;
}

export function findTimeAgoShort(timestamp) {
  const now = new Date();


  const date = new Date(timestamp)

  const timeDifference = now - date;

  const secondsDifference = Math.floor(timeDifference / 1000);

  let agoMessage;

  if (secondsDifference <= 0) {
    agoMessage = "Now";
  } else if (secondsDifference < 60) {
    agoMessage = `${secondsDifference}s`;
  } else if (secondsDifference < 3600) {
    const minutes = Math.floor(secondsDifference / 60);
    agoMessage = `${minutes}m`;
  } else if (secondsDifference < 86400) {
    const hours = Math.floor(secondsDifference / 3600);
    agoMessage = `${hours}h`;
  } else {
    const days = Math.floor(secondsDifference / 86400);
    agoMessage = `${days}d`;
  }

  return agoMessage;
}

function addSuffix(num) {
  // Check if the number is between 11 and 13, as they have special suffixes
  if (num % 100 >= 11 && num % 100 <= 13) {
      return num + "th";
  }

  switch (num % 10) {
      case 1:
          return num + "st";
      case 2:
          return num + "nd";
      case 3:
          return num + "rd";
      default:
          return num + "th";
  }
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December"];

export function strfEventDate(timestamp) {
  const date = new Date(timestamp)
  return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${addSuffix(date.getDate())}`
}

export function strfEventTime(timestamp) {
    const date = new Date(timestamp)
    
    let minutes = date.getMinutes()
    if (minutes === 0) {
        minutes = "00"
    }

    if (0 < minutes && minutes < 10) {
      minutes = "0" + minutes
    }

    let hours = date.getHours()
    let suffix = "";

    if (hours === 0) {
        hours = 12
        suffix = "AM"
    } else {
        if (hours < 12) {
          suffix = "AM"
        } else if (hours === 12) {
          suffix = "PM"
        } else if (hours > 12) {
          suffix = "PM"
          hours -= 12
        }
    }

    return `${hours}:${minutes} ${suffix}`

}

export function combineDateAndTime(date, time) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes()
  );
}



export function abbreviate(inputString) {
    const phrases = inputString.split(', ');
  
    const abbreviation = phrases
      .map(phrase => {
        const words = phrase.split(' ');
        const abbreviatedWords = words
          .map(word => {
            const capitalizedWord = word.replace(/[^A-Z]/g, ''); // Keep only capital letters
            return capitalizedWord;
          })
          .join('');
        return abbreviatedWords;
      })
      .join('-');
  
    return abbreviation.toUpperCase();
  }

  
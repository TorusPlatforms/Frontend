export function findTimeAgo(timestamp) {
    const now = new Date();
    const timeDifference = now - timestamp;

     const secondsDifference = Math.floor(timeDifference / 1000);

    let agoMessage;
    if (secondsDifference == 0) {
      agoMessage = "Just Now";
    } else if (secondsDifference < 60) {
        agoMessage = `${secondsDifference} seconds ago`;
    } else if (secondsDifference < 3600) {
        agoMessage = `${Math.floor(secondsDifference / 60)} minutes ago`;
    } else if (secondsDifference < 86400) {
        agoMessage = `${Math.floor(secondsDifference / 3600)} hours ago`;
    } else {
        agoMessage = `${Math.floor(secondsDifference / 86400)} days ago`;
    }

    return agoMessage
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

export function strfEventTime(timestamp) {
  const date = new Date(timestamp)
  return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${addSuffix(date.getDate())}`
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

  
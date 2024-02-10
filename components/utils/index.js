export function findTimeAgo(timestamp) {
    const now = new Date();
    const timeDifference = now - timestamp;

     const secondsDifference = Math.floor(timeDifference / 1000);

    let agoMessage;
    if (secondsDifference < 60) {
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
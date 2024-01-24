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
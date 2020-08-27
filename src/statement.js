const currencyFormat = () => {
    return new Intl.NumberFormat('en-US', {
               style: 'currency',
               currency: 'USD',
               minimumFractionDigits: 2,
             }).format;
}

const calculateTragedyAmount = (performance) => {
    let tragedyAmount = 40000;
    if (performance.audience > 30) {
        tragedyAmount += 1000 * (performance.audience - 30);
    }
    return tragedyAmount;
}

const calculateComedyAmount = (performance) => {
    comedyAmount = 30000;
    if (performance.audience > 20) {
        comedyAmount += 10000 + 500 * (performance.audience - 20);
    }
    comedyAmount += 300 * performance.audience;
    return comedyAmount;
}

const TRAGEDY = 'tragedy';

const calculateThisAmountByPlayType = (thisAmount, performance, play) => {
    switch (play.type) {
      case TRAGEDY:
        thisAmount = calculateTragedyAmount(performance);
        break;
      case 'comedy':
        thisAmount += calculateComedyAmount(performance);
        break;
      default:
        throw new Error(`unknown type: ${play.type}`);
    }
    return thisAmount;
}

function statement (invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = currencyFormat();

  for (let performance of invoice.performances) {
    const play = plays[performance.playID];
    let thisAmount = 0;
    thisAmount = calculateThisAmountByPlayType(thisAmount, performance, play);
    volumeCredits += Math.max(performance.audience - 30, 0);
    if ('comedy' === play.type) {
        volumeCredits += Math.floor(performance.audience / 5);
    }
    result += ` ${play.name}: ${format(thisAmount / 100)} (${performance.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

module.exports = {
  statement,
};

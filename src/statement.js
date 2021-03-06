const TRAGEDY = 'tragedy';
const COMEDY = 'comedy'

const usdFormat = () => {
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

const calculateThisAmountByPlayType = (thisAmount, performance, play) => {
    switch (play.type) {
      case TRAGEDY:
        thisAmount = calculateTragedyAmount(performance);
        break;
      case COMEDY:
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
  const format = usdFormat();

  for (let performance of invoice.performances) {
    const play = plays[performance.playID];
    let thisAmount = calculateThisAmountByPlayType(0, performance, play);
    volumeCredits += Math.max(performance.audience - 30, 0);
    if (COMEDY === play.type) {
        volumeCredits += Math.floor(performance.audience / 5);
    }
    result += ` ${play.name}: ${format(thisAmount / 100)} (${performance.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

const htmlStatement = (invoice, plays) => {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `<h1>htmlStatement for ${invoice.customer}</h1>`;
    result += `<table>\n`;
    result += `<tr><th>play</th><th>seats</th><th>cost</th></tr>\n`
    const format = usdFormat();
    for (let performance of invoice.performances) {
      const play = plays[performance.playID];
      let thisAmount = calculateThisAmountByPlayType(0, performance, play);
      volumeCredits += Math.max(performance.audience - 30, 0);
      if (COMEDY === play.type) {
          volumeCredits += Math.floor(performance.audience / 5);
      }
      result += `<tr><td>${play.name}</td>`;;
      result += `<td>${performance.audience}</td>`;
      result += `<td>${format(thisAmount / 100)}</td></tr>\n`;
      totalAmount += thisAmount;
    }
    result += `</table>\n`;
    result += `<p>Amount owed is <em>${format(totalAmount / 100)}</em></p>\n`;
    result += `<p>You earned <em>${volumeCredits}</em> credits</p>`;
    return result;
}

module.exports = {
  statement,
  htmlStatement,
};

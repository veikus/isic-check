const {
  apiUrl = 'https://dm.test.aliveplatform.com/api',
  apiUsername = null,
  apiPassword = null,
  isTest = false
} = process.env;

export default function handler(req, res) {
  const {cardholderName, cardNumber} = req.body;
  if (!cardholderName || !cardNumber) {
    res.status(400).json({message: 'Перевірте введені дані'});
    return;
  }

  if (isTest) {
    demoResult(req, res);
    return;
  }

  if (!apiUsername || !apiPassword) {
    console.error('Missing API credentials');
    res.status(500).json({message: 'Сервіс недоступний'});
    return;
  }

  fetch(`${apiUrl}/verifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Encoding': 'UTF-8',
      'Authorization': `Basic ${Buffer.from(`${apiUsername}:${apiPassword}`).toString('base64')}`
    },
    body: JSON.stringify({cardholderName, cardNumber}),
  })
    .then(async apiRes => {
      switch (apiRes.status) {
        case 200:
          res.status(200).json(await apiRes.json());
          break;

        case 400:
          res.status(400).json({message: 'Перевірте введені дані'});
          break;

        // case 401:
        // case 403:
        // case 404:
        default:
          console.error('API error', apiRes.status);
          res.status(500).json({message: 'Сервіс недоступний'});
          break;
      }

    })
    .catch(err => {
      console.error('API error', err);
      res.status(500).json({message: 'Сервіс недоступний'});
    })
}

function demoResult(req, res) {
  const {cardNumber} = req.body;

  if (cardNumber === 'S420539013044P') {
    res.status(200).json({
      id: 3044020,
      createdOn: '2021-01-12T18:21:45+00:00',
      cardNumber: 'S420539013044P',
      cardholderName: 'John Doe',
      mode: 'CARDHOLDER',
      discountId: 12700,
      result: 'SUCCESSFUL',
      cardType: 'ISIC',
      cardholderDateOfBirth: '1997-03-12',
      cardValidLongerThan: '2021-12-31'
    })
  } else {
    res.status(404).json({
      message: 'Картка не знайдена, перевірте введені дані'
    })
  }
}
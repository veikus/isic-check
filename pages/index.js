import React from 'react';
import styles from '../styles/index.module.css'

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardholderName, setCardholderName] = React.useState('');
  const [result, setResult] = React.useState(null);

  function onNameChange(e) {
    setCardholderName(e.target.value);
  }

  function onCardNumberChange(e) {
    setCardNumber(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    fetch('/api/verifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({cardholderName, cardNumber}),
    })
      .then(async res => {
        const data = await res.json();
        setIsLoading(false);
        setResult({
          isSuccess: res.status === 200,
          ...data
        });
      })
      .catch(err => {
        setIsLoading(false);
        setResult({
          isSuccess: false,
          message: err.message
        });
      });
  }

  return <div>
    {
      result && !result.isSuccess &&
      <div className={styles.error}>
        {result.message}
      </div>
    }

    {
      result && result.isSuccess &&
      <div className={styles.success}>
        <div>Номер картки: {result.cardNumber}</div>
        <div>Власник: {result.cardholderName}</div>
        <div>Тип картки: {result.cardType}</div>
        <div>Дата народження: {result.cardholderDateOfBirth}</div>
        <div>Дійсна до: {result.cardValidLongerThan}</div>
      </div>
    }

    <form onSubmit={handleSubmit}>
      <label>
        Номер картки:
        <input type="text" value={cardNumber} onChange={onCardNumberChange} />
      </label>

      <label>
        Ім'я:
        <input type="text" value={cardholderName} onChange={onNameChange} />
      </label>

      <input type="submit" value="Перевірити" disabled={isLoading} />
    </form>
  </div>
}

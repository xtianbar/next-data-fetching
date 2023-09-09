"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FetchComponent = () => {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <button onClick={fetchData}>Fetch Data</button>
      {data && (
        <div>
          <h2>Fetched Data</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      <button onClick={() => router.push('/')}>Go Back to Home</button>
    </div>
  );
};

export default FetchComponent;

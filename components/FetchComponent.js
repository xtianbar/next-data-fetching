"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const FetchComponent = () => {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [countedItems, setCountedItems] = useState(null);

  // Load the input value from localStorage on component mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('savedUrl');
    if (savedUrl) {
      setUrl(savedUrl);
    }
  }, []);

  // Save the input value to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('savedUrl', url);
  }, [url]);

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      const jsonData = await response.json();
      setData(jsonData);
      setError(null); // Clear any previous errors

      // Count items per nesting layer and sort characters
      const countResult = countNestedItems(jsonData, 1);
      setCountedItems(countResult);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data.');
      setData(null); // Clear any previous data
      setCountedItems(null); // Clear any previous counted items
    }
  };

  // Function to count items per nesting layer, sort characters, and convert booleans to "TRUE" or "FALSE"
const countNestedItems = (obj, depth) => {
  if (typeof obj === 'object') {
    const result = { objectCount: 0 };

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result.objectCount++;

        // Sort characters in descending order
        const sortedKey = key.split('').sort((a, b) => {
          if (a < b) return 1;
          if (a > b) return -1;
          return 0;
        }).join('');

        const value = obj[key];
        if (typeof value === 'object') {
          result[sortedKey] = countNestedItems(value, depth + 1);
        } else if (typeof value === 'boolean') {
          // Convert booleans to "TRUE" or "FALSE"
          result[sortedKey] = value ? 'TRUE' : 'FALSE';
        } else {
          result[sortedKey] = value;
        }
      }
    }

    return result;
  } else {
    return obj;
  }
};


  return (
    <div className='w-full'>
      <div className='flex flex-row gap-2 justify-center text-center items-center mb-4'>
        <span className='p-2'>URL:</span>
      <input className='w-[80%] border border-black p-2'
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL" 
        required
      />
      <button className='bg-blue-500 w-[15%] p-2 text-white hover:bg-blue-400' onClick={fetchData}>Query</button>
      </div>
      {error && <p className='p-2' style={{ color: 'red' }}>{error}</p>}
      {data && (
        <div className='w-full grid grid-cols-2 gap-2 text-xs p-2'>
          <div className='overflow-x-auto border-2 border-black p-2'>
            <h2 className='text-base font-semibold mb-2'>URL Response</h2>
            <pre className='w-[50%]'>{JSON.stringify(data, null, 2)}</pre>
          </div>
          <div className='overflow-x-auto border-2 border-black p-2'>
            <h2 className='text-base font-semibold mb-2'>Processed URL Response</h2>
            <pre className='w-[50%]'>{JSON.stringify(countedItems, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchComponent;

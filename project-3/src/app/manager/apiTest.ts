// Import necessary database functions from db.ts
//import { NextApiRequest, NextApiResponse } from 'next';
import { fetchDataFromDB } from '../../../lib/db';

// Handler function for the API route
async function fetchProductUsageData() {
  try {
    // Fetch data from the database
    const data = await fetchDataFromDB();
    
    console.log('Data from database:', data);
  } catch (error) {
    console.error('Error fetching data from database:', error);
  }
}
fetchProductUsageData();
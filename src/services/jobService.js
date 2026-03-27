// jobService.js – Axios service for fetching "suggested jobs" from dummyjson.
// This is purely for demo/API usage demonstration, not for real job data.
import axios from 'axios';

// Create an axios instance so we can set a base URL once
const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 8000,
});

/**
 * Fetches products from dummyjson and maps them to a "suggested job" shape.
 * This shows how Axios is used for external API calls.
 */
export async function fetchSuggestedJobs() {
  const response = await apiClient.get('/products?limit=6');
  const products = response.data.products;

  // Map product fields to job-like fields
  return products.map((product) => ({
    id: product.id,
    company: product.brand || 'Tech Corp',
    role: product.title,
    location: 'Remote',
    salary: Math.round(product.price * 1000).toLocaleString(),
    rating: product.rating,
    thumbnail: product.thumbnail,
  }));
}

import axios from 'axios';

const BASE_URL = 'http://localhost:5500';

async function testRateLimit() {
  try {
    // Make 15 requests in quick succession
    for (let i = 1; i <= 15; i++) {
      try {
        const response = await axios.get(BASE_URL);
        console.log(`Request ${i}: ${response.status} - ${response.statusText}`);
      } catch (error) {
        if (error.response) {
          console.log(`Request ${i}: ${error.response.status} - ${error.response.statusText}`);
        } else {
          console.log(`Request ${i}: ${error.message}`);
        }
      }
      // Small delay to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testRateLimit();

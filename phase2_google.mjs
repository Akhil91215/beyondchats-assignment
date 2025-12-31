import googleIt from 'google-it';

async function runGoogleSearch() {
  try {
    const results = await googleIt({
      query: 'Choosing the right AI chatbot',
      limit: 10,
    });

    console.log('RAW GOOGLE RESULTS:\n');
    console.log(results);
  } catch (error) {
    console.error('Google search error:', error);
  }
}

runGoogleSearch();

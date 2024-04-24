  // Get the query parameter from the URL
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const data = urlParams.get('data');

        // Use the data as needed
        console.log('Received data:', data);
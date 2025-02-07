/**
 * Function to report web vital metrics.
 * 
 * @param {Function} onPerfEntry - Callback function to handle web vital metrics.
 */
 const reportWebVitals = onPerfEntry => {
  // Check if the onPerfEntry callback is provided and is a function
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import web-vitals library
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Call each web vital metric function and pass the onPerfEntry callback
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

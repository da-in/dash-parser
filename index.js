// Dependencies: axios for HTTP requests and xml2js for XML parsing
const axios = require('axios');
const xml2js = require('xml2js');

const parseMPD = async (mpdUrl) => {
  try {
    // Fetch the MPD file
    const response = await axios.get(mpdUrl);
    const mpdData = response.data;

    // Parse the MPD file
    const parser = new xml2js.Parser();
    const mpd = await parser.parseStringPromise(mpdData);

    // Extract Periods
    const periods = mpd.MPD.Period || [];
    periods.forEach((period, periodIndex) => {
      console.log(`Period ${periodIndex + 1}`);

      // Extract Adaptation Sets
      const adaptationSets = period.AdaptationSet || [];
      adaptationSets.forEach((adaptationSet, adaptationSetIndex) => {
        const mimeType = adaptationSet.$.mimeType || 'undefined';
        const codecs = adaptationSet.$.codecs || 'undefined';
        console.log(`  Adaptation Set ${adaptationSetIndex + 1}`);
        console.log(`    mimeType: ${mimeType}`);
        console.log(`    codecs: ${codecs}`);

        // Extract Representations
        const representations = adaptationSet.Representation || [];
        representations.forEach((representation, representationIndex) => {
          const id = representation.$.id || 'undefined';
          const bandwidth = representation.$.bandwidth || 'undefined';
          const width = representation.$.width || 'undefined';
          const height = representation.$.height || 'undefined';
          const baseURL = representation.BaseURL ? representation.BaseURL[0] : 'undefined';
          console.log(`      Representation ${representationIndex + 1}`);
          console.log(`        id: ${id}`);
          console.log(`        bandwidth: ${bandwidth}`);
          console.log(`        width: ${width}`);
          console.log(`        height: ${height}`);
          console.log(`        BaseURL: ${baseURL}`);
        });
      });
    });
  } catch (error) {
    console.error('Error parsing MPD:', error);
  }
};


// Example usage:
const mpdUrl = 'https://livesim.dashif.org/livesim/chunkdur_1/ato_7/testpic4_8s/Manifest.mpd'
parseMPD(mpdUrl);

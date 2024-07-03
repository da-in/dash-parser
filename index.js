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
    const periods = mpd.MPD.Period;
    periods.forEach((period, periodIndex) => {
      console.log(`Period ${periodIndex + 1}`);

      // Extract Adaptation Sets
      const adaptationSets = period.AdaptationSet;
      adaptationSets.forEach((adaptationSet, adaptationSetIndex) => {
        console.log(`  Adaptation Set ${adaptationSetIndex + 1}`);
        console.log(`    mimeType: ${adaptationSet.$.mimeType}`);
        console.log(`    codecs: ${adaptationSet.$.codecs}`);

        // Extract Representations
        const representations = adaptationSet.Representation;
        representations.forEach((representation, representationIndex) => {
          console.log(`      Representation ${representationIndex + 1}`);
          console.log(`        id: ${representation.$.id}`);
          console.log(`        bandwidth: ${representation.$.bandwidth}`);
          console.log(`        width: ${representation.$.width}`);
          console.log(`        height: ${representation.$.height}`);
          console.log(`        BaseURL: ${representation.BaseURL[0]}`);
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

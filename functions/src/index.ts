import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';
// import * as moment from 'moment';

admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

interface Daily {
  provinceState: string;
  countryRegion: string;
  lastUpdate: string;
  confirmed: string;
  deaths: string;
  recovered: string;
}

const countyUrl = 'https://covid19.mathdro.id/api/countries/us/confirmed';
const byCountryUrl = 'https://covid19.mathdro.id/api/countries/';
const worldUrl = 'https://covid19.mathdro.id/api';

export const getStates = functions.https.onRequest((request, response) => {
  return fetch(countyUrl)
    .then((data) => data.json())
    .then((data) => {
      const states: Array<any> = [];
      data.forEach((state, idx) => {
        const temp = {
          name: state.provinceState,
          country: state.countryRegion,
          counties: {},
        };
        const isAdded = states.find((x) => x['name'] === state.provinceState);
        if (isAdded === undefined) {
          states.push(temp);
        }
      });
      return states;
    })
    .then((data) => {
      return data.forEach((state, idx) => {
        db.collection('states')
          .doc(state.name)
          .set(state)
          .then(() => {
            if (idx === data.length - 1) {
              return response.send('done');
            }
          });
      });
    });
});

export const getCountyDetail = functions.https.onRequest(
  (request, response) => {
    return fetch(countyUrl)
      .then((data) => data.json())
      .then((data: Array<any>) => {
        data.forEach((county, idx) => {
          county['county'] = county.combinedKey.split(',')[0];
          county['stateSearch'] = county.provinceState.toLowerCase();
          county['countySearch'] = county.county.toLowerCase();
          county['nameSearch'] = county['stateSearch'];
          db.collection('counties')
            .where('combinedKey', '==', county.combinedKey)
            .get()
            .then((data) => {
              if (data.size > 0) {
                return data.forEach((countyDoc) => {
                  db.collection('counties').doc(countyDoc.id).update(county);
                });
              } else {
                db.collection('counties').add(county);
              }
            })
            .then(() => {
              if (idx === data.length - 1) {
                return response.send('done');
              }
            });
        });
      });
  }
);

export const getCountyData = functions.https.onRequest((request, response) => {
  return fetch(countyUrl)
    .then((data) => data.json())
    .then((data: Array<any>) => {
      return db
        .collection('states')
        .get()
        .then((x) => {
          x.docs.forEach((state, idx) => {
            const tempData = data.filter(
              (a) => a.provinceState === state.data().name
            );
            const tempState = state.data();
            const confirmed = tempData.reduce((acc, curr) => {
              return acc + curr.confirmed;
            }, 0);
            tempState.confirmed = confirmed;
            const recovered = tempData.reduce((acc, curr) => {
              return acc + curr.recovered;
            }, 0);
            tempState.recovered = recovered;
            const deaths = tempData.reduce((acc, curr) => {
              return acc + curr.deaths;
            }, 0);
            tempState.deaths = deaths;
            const active = tempData.reduce((acc, curr) => {
              return acc + curr.active;
            }, 0);
            tempState.active = active;
            const tested = tempData.reduce((acc, curr) => {
              return acc + curr.tested;
            }, 0);
            tempState.tested = tested;
            const hospitalized = tempData.reduce((acc, curr) => {
              return acc + curr.hospitalized;
            }, 0);
            tempState.hospitalized = hospitalized;
            const lastUpdate = tempData.reduce((acc, curr) => {
              return Math.max(acc, curr.lastUpdate);
            }, 0);
            tempState.lastUpdate = lastUpdate;
            tempState.nameSearch = tempState.name.toLowerCase();
            return db
              .collection('states')
              .doc(tempState.name)
              .update(tempState)
              .then(() => {
                if (idx === x.docs.length - 1) {
                  return response.send('it is done');
                }
              });
          });
        });
    });
});

export const getDaily = functions.https.onRequest((request, response) => {
  const a = new Date();
  const b = `${a.getMonth() + 1}-${a.getDate()}-${a.getFullYear()}`;
  const beginUrl = `https://covid19.mathdro.id/api/daily/${b}`;
  return fetch(beginUrl)
    .then((data) => data.json())
    .then((data: Array<Daily>) => {
      if (data.length === 0) {
        return response.send('no data');
      }
      const current = new Date(data[0].lastUpdate);
      const currentDate = `${
        current.getMonth() + 1
      }-${current.getDate()}-${current.getFullYear()}`;
      return db
        .collection('daily')
        .doc(currentDate)
        .set({ items: data })
        .then(() => {
          return response.send(`Done with ${currentDate}`);
        });
    });
});

export const getDailyByCountry = functions.https.onRequest(
  (request, response) => {
    const a = new Date();
    const b = `${a.getMonth() + 1}-22-${a.getFullYear()}`;
    const beginUrl = `https://covid19.mathdro.id/api/daily/${b}`;
    return fetch(beginUrl)
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        // const tempObj = {};
        return data.forEach((c, idx) => {
          return db
            .collection('dailyByCountry')
            .doc(c.countryRegion)
            .set({ [b]: c })
            .then(() => {
              if (idx === data.length - 1) {
                response.send('done');
              }
            });
          // if (!tempObj[c.countryRegion]) {
          //   tempObj[c.countryRegion] = {};
          // }
          // if (idx === data.length - 1) {
          //   response.send(tempObj);
          // }
        });
      });
  }
);

// const saveCountries = (data: any) => {
//   return data;
// }

export const getCountries = functions.https.onRequest((request, response) => {
  return fetch(byCountryUrl)
    .then((data) => data.json())
    .then((data) => {
      let numCountries = 0;
      data.countries.forEach((country, idx) => {
        const tempCountry = country;
        getCountryData(country.iso2)
          .then((countryData) => countryData.json())
          .then((countryData) => {
            if (
              !countryData.error &&
              country.name !== 'Diamond Princess' &&
              country.name !== 'MS Zaandam'
            ) {
              tempCountry['data'] = countryData;
              tempCountry['nameSearch'] = country.name.toLowerCase();
              db.collection('countries')
                .doc(country.name)
                .set(tempCountry)
                .then(() => {
                  numCountries++;
                  if (idx === data.countries.length - 1) {
                    response.send(`updated ${numCountries} countries.`);
                  }
                });
            }
          });
      });
    });
  // .then((data) => {
  //   const states: Array<any> = [];
  //   data.forEach((state, idx) => {
  //     const temp = {
  //       name: state.provinceState,
  //       country: state.countryRegion,
  //       counties: {},
  //     };
  //     const isAdded = states.find((x) => x['name'] === state.provinceState);
  //     if (isAdded === undefined) {
  //       states.push(temp);
  //     }
  //   });
  //   return states;
  // })
  // .then((data) => {
  //   return data.forEach((state, idx) => {
  //     db.collection('states')
  //       .doc(state.name)
  //       .set(state)
  //       .then(() => {
  //         if (idx === data.length - 1) {
  //           return response.send('done');
  //         }
  //       });
  //   });
  // });
});

const getCountryData = (country) => {
  return fetch(`${byCountryUrl}${country}`);
};

export const getWorldData = functions.https.onRequest((request, response) => {
  return fetch(worldUrl)
    .then((data) => data.json())
    .then((data) => {
      return db
        .collection('countries')
        .doc('world')
        .set({
          name: 'World',
          data: data,
          population: 7646500000,
        })
        .then(() => response.send('done'));
    });
});

export const processCountyPop = functions.https.onRequest(
  (request, response) => {
    return fetch(
      'https://api.census.gov/data/2019/pep/population?get=DENSITY,POP,NAME&for=county:*'
    )
      .then((data) => data.json())
      .then((data: Array<any>) => {
        return data.forEach((item, idx) => {
          if (idx > 0) {
            const tempObj: any = {};
            tempObj['density'] = item[0];
            tempObj['value'] = item[1];
            let combinedKey;
            if (item[2].includes(' County')) {
              combinedKey = item[2].replace(' County', '');
              tempObj['combinedKey'] = combinedKey;
              tempObj['county'] = tempObj['combinedKey'].split(', ')[0];
              tempObj['state'] = tempObj['combinedKey'].split(', ')[1];
            }
            if (item[2].includes(' Parish')) {
              combinedKey = item[2].replace(' Parish', '');
              tempObj['combinedKey'] = combinedKey;
              tempObj['county'] = tempObj['combinedKey'].split(', ')[0];
              tempObj['state'] = tempObj['combinedKey'].split(', ')[1];
            }
            if (!item[2].includes(' Parish') && !item[2].includes(' County')) {
              combinedKey = item[2];
              tempObj['combinedKey'] = combinedKey;
              tempObj['county'] = tempObj['combinedKey'].split(', ')[0];
              tempObj['state'] = tempObj['combinedKey'].split(', ')[1];
            }
            tempObj['nameSearch'] = tempObj.stateSearch;
            console.log(tempObj);
            return db
              .collection('counties')
              .where('combinedKey', '==', `${tempObj.combinedKey}, US`)
              .get()
              .then((data2) => {
                console.log(data2.size);
                if (data2.size > 0) {
                  data2.forEach((dataDoc) => {
                    const temp = dataDoc.data();
                    temp['population'] = tempObj;
                    db.collection('counties').doc(dataDoc.id).update(temp);
                  });
                }
              });
          }
          if (idx === data.length - 1) {
            response.send('done');
          }
        });
      });
  }
);

export const setNycPop = functions.https.onRequest((request, response) => {
  return db
    .collection('counties')
    .where('combinedKey', '==', 'New York City, New York, US')
    .get()
    .then((data) => {
      const docs = data.docs;
      const doc = docs[0];
      const theDoc = doc.data();
      theDoc['population'] = {
        combinedKey: 'New York City, New York',
        county: 'New York City',
        state: 'New York',
        value: '8398748',
      };
      return doc.ref.update(theDoc).then((resp) => {
        return response.send(resp);
      });
    });
});

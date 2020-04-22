import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';
// import * as moment from 'moment';

admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

// const beginUrl = 'https://covid19.mathdro.id/api/daily/1-22-2020';
const countyUrl = 'https://covid19.mathdro.id/api/countries/us/confirmed';

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
          return db
            .collection('counties')
            .add(county)
            .then(() => {
              if (idx === data.length - 1) {
                return response.send('update is done');
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

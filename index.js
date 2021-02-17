import fastify from 'fastify';
// see axios doc on how to use it
import axios from 'axios';

const app = fastify({ logger: true });

app.get('/', async (req, res) => {
  return getData();
});

//getting the catFact


// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Get cat facts
const getCatFact = (base) => {
  return new Promise(resolve => {
    axios.get(`https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=${base}`).then(res => {
      const data = res.data;
      let tab = [];
      for (let i = 0; i < data.length; i++) {
        tab.push(data[i].text);
      }
      resolve(tab);
    }).catch(err => {
      resolve(null);
    })
  });
};

// Get fox image
const getFoxImage = () => {
  return new Promise(resolve => {
    axios.get(`https://randomfox.ca/floof/`).then(res => {
      const data = res.data;
      resolve(data.image);
    }).catch(err => {
      resolve(null);
    })
  });
};

// Get days off by country code
const getDay = (country) => {
  return new Promise(resolve => {
    axios.get(`https://date.nager.at/api/v2/PublicHolidays/2021/${country}`).then(res => {
      const data = res.data;
      resolve(data);
    }).catch(err => {
      resolve(null);
    })
  });
};

// Get all API
const getData = () => {
  const catFact = getCatFact(2);
  const fox = getFoxImage();
  const day = getDay('FR');

  return Promise.all([catFact, fox, day]).then((values) => {
    let val = {};

    val['catFact'] = values[0];
    val['foxPicture'] = values[1];
    val['holidays'] = values[2];
    return val;
  });
};

start();
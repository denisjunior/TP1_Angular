import fastify from 'fastify';
// see axios doc on how to use it
import axios from 'axios';

const app = fastify({ logger: true });

app.get('/', async (req, res) => {
  return getData();
});

// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

//get a cat fact
const getCatFact = (base) => {
  return new Promise(resolve => {
    axios.get(`https://cat-fact.herokuapp.com/facts/random?animal_type=cat&base=`+ base).then(response => {
      const data = response.data;
      let tab = [];
      for (let i =0; i<data.length; i++){
        tab.push(data[i].text);
      }
      resolve(tab);
    }).catch(error =>{
      resolve(null);
    })
  });
};
// get a fox image
const getFox = () => {
  return new Promise(resolve => {
    axios.get(`https://randomfox.ca/floof/`).then(response => {
      const data = response.data;
      resolve(data.image);
    }).catch(error => {
      resolve(null);
    })
  });
};

// get country day off
const getDay = (country) =>{
  return new Promise(resolve => {
    axios.get(`https://date.nager.at/api/v2/PublicHolidays/2021/` + country).then(response => {
      const data = response.data;
      resolve(data);
    }).catch(error => {
      resolve(null);
    })
  });
};

//
const getData = () => {
  const cat = getCatFact(3);
  const foxImage= getFox();
  const day = getDay('FR');

  return Promise.all([cat, foxImage, day]).then((values) => {
    let val = {}
    val['catFacts'] = values[0];
    val['foxPicture']= values[1];
    val['holidays']= values[2];
    return val;
  })
}

start();

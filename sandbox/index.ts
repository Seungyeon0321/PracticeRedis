import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
  try {
    await client.del('car')
    
    await client.hSet('car', {
    color: 'red',
    year: 2024,
   
  });
  // HSET car color red year 2024 mileage 10000
    const car = await client.hGetAll('car#adfsdf');
    
    if(Object.keys(car).length === 0) {
      console.log('car not found');
      return;
    }

    console.log(car);
  } catch (e) {
    console.error(e);
  }
};
run();

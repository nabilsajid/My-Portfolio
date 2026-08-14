import * as si from 'react-icons/si';

const keys = Object.keys(si);
const adobe = keys.filter(k => k.toLowerCase().includes('adobe'));
const davinci = keys.filter(k => k.toLowerCase().includes('davinci') || k.toLowerCase().includes('resolve'));

console.log('Adobe:', adobe);
console.log('DaVinci:', davinci);
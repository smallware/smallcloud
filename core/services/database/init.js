
module.exports = function*(S){

  console.log('\n>>>', 'Running Database init...');
  console.log('>>> api', S);
  console.log('>>> this', this);

  return '[Database API]';
};


module.exports = function*(S){

  console.log('>>>', 'Running Resources init...');
  console.log('>>> api', S);
  console.log('>>> this', this);

  return '[Resources API]';
};
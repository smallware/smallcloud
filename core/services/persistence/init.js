

module.exports = function*(S){

  console.log('>>>', 'Running Persistence init...');
  console.log('>>> api', S);
  console.log('>>> this', this);

  return '[Persistence API]';
};
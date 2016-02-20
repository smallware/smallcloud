

module.exports = function*(S){

  S.log('info', 'Running persistence service init...');
  S.log('debug', S);
  S.log('debug', this);

  //console.log('>>>', 'Running Persistence init...');
  //console.log('>>> api', S);
  //console.log('>>> this', this);

  return '[[Persistence API]]';
};
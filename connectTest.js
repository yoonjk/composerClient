const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');

const bnc = new BusinessNetworkConnection();
const connHistorianAll = async() => {
  let historian = await bnc.getHistorian();
  let historianRecords = await historian.getAll();
  console.log('historian:',(historianRecords));
};
const connHistorianTime = async() => {
  let now = new Date();
  now.setMinutes(10);  // set the date to be time you want to query from

  let q1 = bnc.buildQuery('SELECT org.hyperledger.composer.system.HistorianRecord ' +
                                                'WHERE (transactionTimestamp > _$justnow)');   

  let result = await bnc.query(q1,{justnow:now});
  console.log('historianTime:',result);
}

const connHistorianTxType = async() => {
    // build the special query for historian records
  let q1 = bnc.buildQuery(
      `SELECT org.hyperledger.composer.system.HistorianRecord
          WHERE (transactionType == 'org.example.basic.SampleTransaction')`
  );      

  let result = await bnc.query(q1);
  console.log('Historian TxType result:', result);
  console.log('Historian TxType event:', JSON.stringify(result.ValidatedResource))

}

const connEvent = async() => {
  //const bnc = new BusinessNetworkConnection();
  await bnc.connect('admin@sample-network');
  console.log('connEvent');
  connHistorianTime();
  connHistorianTxType();
  bnc.on('event', (event) => {
    // event: { "$class": "org.namespace.BasicEvent", "eventId": "0000-0000-0000-000000#0" }
    console.log('event:',event);
  });
}
connEvent();


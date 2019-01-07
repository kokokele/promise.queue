const QueuePromise = require('../index');


let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p1 success;');
  }, 1000);
})

let p2 = new Promise((resolve, reject) => {
  // resolve('success')
  setTimeout(() => {
    reject('p2 error;');
  }, 100)
});
p2.catch(err => {

})

let p3 = new Promise((resolve, reject) => {
  resolve('p3 success;')
});


describe('queue', () => {

  it('normal', (done) => {
    const fn = jest.fn();

    let exp = '';
    const qp = new QueuePromise([p1, p2, p3], {
      callback: () => {
        console.log('done:', exp);
        expect(exp).toBe('p1 success;p2 error;p3 success;');
        done();
      },
      errorInterrupt: false
    });

    qp.on('success', res => {
      console.log('success:', res);
      exp += res;
    });
    qp.on('error', err => {
      console.log('error', err);
      exp += err
    });

    qp.run();
  });
});
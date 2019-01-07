const QueuePromise = require('../index');


let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p1 success');
  }, 1000);
})

let p2 = new Promise((resolve, reject) => {
  // resolve('success')
  setTimeout(() => {
    reject('p2 error');
  }, 100)
});

let p3 = new Promise((resolve, reject) => {
  resolve('p2 success')
});


describe('queue', () => {

  it('normal', () => {
    const fn = jest.fn();
    const qp = new QueuePromise([p1, p2, p3], {
      callback: () => {
      
      },
      errorInterrupt: false
    });

    qp.run();
  });
})





const QueuePromise = require('../index');

const RETURN_VAL = ['p1', 'p2', 'p3', 'p4', 'p5'];
let p0 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(RETURN_VAL[0]);
    }, 1000);
  });
}

let p1 = () => {
  return new Promise((resolve, reject) => {
    // resolve('success')
    setTimeout(() => {
      reject(RETURN_VAL[1]);
    }, 100)
  });
}

let p2 = () =>  new Promise((resolve, reject) => {
  resolve(RETURN_VAL[2]);
});

let p3 = () => 'no promise';


describe('queue', () => {

  it('normal', done => {
    const fn = jest.fn()
    const qp = new QueuePromise([p0, p1, p2], {
      callback: () => {
        // console.log(fn.mock.calls[0][0]);
        // console.log(fn.mock.calls[1][0]);
        // console.log(fn.mock.calls[2][0]);
        const params = fn.mock.calls;
        expect(params[0][0]).toBe(RETURN_VAL[0]);
        expect(params[1][0]).toBe(RETURN_VAL[1]);
        expect(params[2][0]).toBe(RETURN_VAL[2]);
        done();
      },
      errorInterrupt: false
    }); 

    qp.on('success', fn);
    qp.on('error', fn);
    qp.run();
  });

  it('return no promise', done => {
    const fn = jest.fn()
    const qp = new QueuePromise([p0, p1, p2, p3], {
      callback: () => {
        // console.log(fn.mock.calls[0][0]);
        // console.log(fn.mock.calls[1][0]);
        console.log(fn.mock.calls[3][0]);
        const params = fn.mock.calls;
        expect(params[0][0]).toBe(RETURN_VAL[0]);
        expect(params[1][0]).toBe(RETURN_VAL[1]);
        expect(params[2][0]).toBe(RETURN_VAL[2]);

        // test
        expect(params[3][0]).toEqual(new Error('return value is not Promise type'));
        done();
      },
      errorInterrupt: false
    }); 

    qp.on('success', fn);
    qp.on('error', fn);
    qp.run();
  });

  it('errorInterrupt = true', done => {
    const fn = jest.fn()
    const qp = new QueuePromise([p0, p1, p2], {
      callback: () => {
        const params = fn.mock.calls;
        expect(params[2]).toBeUndefined();
        // expect(params[1][0]).toBe(RETURN_VAL[1]);
        // expect(params[2][0]).toBe(RETURN_VAL[2]);
        done();
      },
      errorInterrupt: true
    }); 

    qp.on('success', fn);
    qp.on('error', fn);
    qp.run();
  });
})
# Promise.queue
[![NPM](https://nodei.co/npm/promise-queue-easy.png)](https://nodei.co/npm/promise-queue-easy/)
[![Build Status](https://travis-ci.org/kokokele/promise.queue.svg?branch=master)](https://travis-ci.org/kokokele/promise.queue.svg?branch=master)
[![codecov](https://codecov.io/gh/kokokele/promise.queue/branch/master/graph/badge.svg)](https://codecov.io/gh/kokokele/promise.queue)
[![NPM Version](https://img.shields.io/npm/v/promise-queue-easy.svg?style=flat)](https://img.shields.io/npm/v/promise-queue-easy.svg?style=flat)
[![Dowload](https://img.shields.io/npm/dm/promise-queue-easy.svg)](https://npmcharts.com/compare/promise-queue-easy?minimal=true&interval=30)
![Total visitor](https://visitor-count-badge.herokuapp.com/total.svg?repo_id=kokokele.promise.queue)
![Visitors in today](https://visitor-count-badge.herokuapp.com/today.svg?repo_id=kokokele.promise.queue)

## support
- AMD
- CommonJS
- Browser

## install
```
npm i promise-queue-easy
or
yarn add promise-queue-easy
```

## test
```
npm run test
```

## Example

```js
const QueuePromise = require('promise-queue-easy');


let p1 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1 success;');
    }, 1000);
  });
}

let p2 = () => {
  return new Promise((resolve, reject) => {
    // resolve('success')
    setTimeout(() => {
      reject('p2 error;');
    }, 100)
  });
}

let p3 = () =>  new Promise((resolve, reject) => {
  resolve('p3 success;')
});



const qp = new QueuePromise([p1, p2, p3], {
  callback: function() {
    console.log('===all done===');
  },
  errorInterrupt: false
});

qp.on('success', res => {
  // res
});
qp.on('error', err => {
  //err
})

qp.run();
```

## doc

####  new QueuePromise(queue, options):
```
 queue : promise queue,
 options: {
  callback: Function // all done callback,
  errorInterrupt: Boolean // True stops subsequent execution when an error is encountered and vice versa
 }
```

#### methods:

- on(event, handle): `each execution call`

```
event: String ('success' or 'error');
hanlde: Function
```

- add(fun：Function) 
`add promise in queue`

- pause():
`pasue execute`

- resume():
` resume queue execute`

- get running :
 `return Boolean `






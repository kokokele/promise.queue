# Promise.queue

[![Build Status](https://travis-ci.org/kokokele/promise.queue.svg?branch=master)](https://travis-ci.org/kokokele/promise.queue.svg?branch=master)

[![NPM Version](https://img.shields.io/npm/v/promise-queue-easy.svg?style=flat)](https://img.shields.io/npm/v/promise-queue-easy.svg?style=flat)

## install
npm i promise-queue-easy


## Example

```js
const QueuePromise = require('promise-queue-easy');


let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('1s after');
  }, 1000);
})

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('p2 error');
  }, 100);
});

let p3 = new Promise((resolve, reject) => {
  resolve('p2 success')
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
qp.on('error', res => {
  //error
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

- on(event, handle): each execution call

```
event: String ('success' or 'error');
hanlde: Function
```

- add(promise) 
> add promise in queue

- pause()
> pasue execute

- resume()
> resume queue execute






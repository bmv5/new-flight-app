import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    ramping_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5s', target: 5 },
        { duration: '10s', target: 10 },
        { duration: '5s', target: 0 },
      ],
      exec: 'rampingScenario',
    },
    constant_test: {
      executor: 'constant-vus',
      vus: 3,
      duration: '20s',
      exec: 'constantScenario',
      startTime: '25s', // запуск другого сценарію після завершення першого
    },
  },
};

export function rampingScenario() {
  const res = http.get('https://jsonplaceholder.typicode.com/posts/1');
  check(res, {
    'GET /posts/1 status is 200': (r) => r.status === 200,
  });
  sleep(1);
}

export function constantScenario() {
  const payload = JSON.stringify({
    title: 'Constant VUs test',
    body: 'Body of the post',
    userId: 1,
  });

  const headers = { 'Content-Type': 'application/json' };
  const res = http.post('https://jsonplaceholder.typicode.com/posts', payload, { headers });

  check(res, {
    'POST /posts status is 201': (r) => r.status === 201,
    'POST returns id': (r) => r.json().id !== undefined,
  });

  sleep(1);
}

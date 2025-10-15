export const handler = async () => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  },
  body: [
    'retry: 500\n',
    'event: token\n',
    'data: {"t":"Recruiter","pol":0.4,"conf":0.82,"aspect":"communication"}\n\n',
    'event: token\n',
    'data: {"t":"followed","pol":0.6,"conf":0.86,"aspect":"communication"}\n\n'
  ].join('')
});

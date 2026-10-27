import handleRequest from '../server/api_server.js';

export default async function handler(req, res) {
  return handleRequest(req, res);
}

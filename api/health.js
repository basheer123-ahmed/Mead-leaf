export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'Meadleaf API Server is healthy',
    timestamp: new Date().toISOString()
  });
}

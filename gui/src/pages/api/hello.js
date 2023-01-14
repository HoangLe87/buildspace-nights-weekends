export default function handler(req, res) {
  let a = Math.random()
  res.status(200).json({ a })
}

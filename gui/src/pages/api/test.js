

export default async function Home(req, res) {
  try {
    if (req.method === 'GET') {
      return res.status(200).json('this works')
    }
  } catch (error) {
    return res.status(400).json(error)
  }
}

import express from 'express';
import client from 'prom-client'

const router = express.Router()

const collectDefaultMetrics = client.collectDefaultMetrics;

const Registry = client.Registry;

const register = new Registry();

collectDefaultMetrics({ register });
register.metrics().then(str => console.log(str));

router.get('/', async (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})

export default router

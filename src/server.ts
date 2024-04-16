import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

// Ensure plugins are registered in the correct order
app.register(transactionsRoutes, { prefix: '/transactions' })

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP Server Running')
})

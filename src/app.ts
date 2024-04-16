import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

// Ensure plugins are registered in the correct order
app.register(cookie)
app.register(transactionsRoutes, { prefix: '/transactions' })

import { execSync } from 'node:child_process'
import { describe, it, beforeAll, afterAll, expect, beforeEach } from 'vitest'
import request from 'supertest'

import { app } from '../src/app'

describe('Transaction routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('pnpm run knex migrate:rollback --all')
    execSync('pnpm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({ title: 'Test transaction', amount: 340, type: 'credit' })
      .expect(201)
  })

  it('should be able to get all transactions', async () => {
    const transactionData = { title: 'Test transaction', amount: 340 }
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({ ...transactionData, type: 'credit' })

    const cookies = createTransactionResponse.get('Set-Cookie') || []

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining(transactionData),
    ])
  })

  it('should be able to get a specific transaction by id', async () => {
    const transactionData = { title: 'Test transaction', amount: 340 }
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({ ...transactionData, type: 'credit' })

    const cookies = createTransactionResponse.get('Set-Cookie') || []

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id
    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining(transactionData),
    )
  })

  it('should be able to get a users total funds', async () => {
    const transactionOneData = { title: 'Test transaction one', amount: 340 }
    const transactionTwoData = { title: 'Test transaction two', amount: 100 }

    const createTransactionOneResponse = await request(app.server)
      .post('/transactions')
      .send({ ...transactionOneData, type: 'credit' })

    const cookies = createTransactionOneResponse.get('Set-Cookie') || []

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({ ...transactionTwoData, type: 'debit' })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({ amount: 240 })
  })
})

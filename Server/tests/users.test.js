const request = require('supertest')
const {app} = require('../app')
const { sequelize, Users, Profiles } = require('../models')

beforeAll(async () => {
    try {
        await sequelize.sync({ force: true });
    } catch (err) {
        console.log(err)
    }
});

afterAll(async () => {
    await sequelize.close()
})

describe('POST /register', () => {
    test('✅ should create a new user and profile', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({
        username: 'cakrabsva',
        email: 'cakra@example.com',
        password: 'Sunowl1811'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('Message', 'Sucessfully Register');

    // Optional: cek apakah profilnya juga tercipta
    const user = await Users.findOne({ where: { email: 'cakra@example.com' } });
    const profile = await Profiles.findOne({ where: { UserId: user.id } });
    expect(profile).not.toBeNull();
    });

    test('❌ should fail if username already exists', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({
        username: 'cakrabsva',
        email: 'cakra@example123.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Username already exist!/i);
    });

    test('❌ should fail if username is empty', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({
        username: '',
        email: 'cakra@example123.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Please insert your username/i);
    });

    test('❌ should fail if email already exists', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({
        username: 'cakraduplicate',
        email: 'cakra@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Email already exist!/i);
    });

    test('❌ should fail if email is empty', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({
        username: 'cakra',
        email: '', // invalid
        password: 'password123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/email/i);
    });

    test('❌ should fail if email is incorrect email format', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({
        username: 'cakra',
        email: 'cakra.example.com',
        password: 'password123'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid email format/i);
    });

    test('❌ should fail if password is empty', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({
        username: 'cakrabsva',
        email: 'cakra@example123.com',
        password: ''
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Please insert your password/i);
    });

    test('❌ should fail if password less than 8 character', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({
        username: 'cakrabsva',
        email: 'cakra@example123.com',
        password: 'jono'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Password minimum 8 character/i);
    });
});
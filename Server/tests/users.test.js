const request = require('supertest')
const {app} = require('../app')
const { sequelize, Users, Profiles } = require('../models');
const { Password } = require('../helpers/Password');
const { Jwt } = require('../helpers/Jasonwebtoken');

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
    expect(res.body.message).toMatch(/Sucessfully Register/i)

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

describe('POST /login', () => {

  test('✅ should get access Token for login', async () => {

    const username ='cakrabsva'
    const password = 'Sunowl1811'
    const user = await Users.findOne({ where: { username } });
    const res = await request(app)
      .post('/user/login')
      .send({
        username,
        password
      })
    const checkingPassword = Password.comparePassword(password, user.password)
    const accessToken = Jwt.getToken({id: user.id})

    expect(user).not.toBeNull()
    expect(checkingPassword).toBe(true)
    expect(typeof accessToken).toBe('string')
    expect(res.statusCode).toBe(201)
    expect(res.body).toMatchObject({message:'Login Success',token: accessToken, username: user.username})
  })

  test('❌ should fail if username empty', async () => {

    const username =''
    const password = 'Sunowl1811'
    await Users.findOne({ where: { username } });
    const res = await request(app)
      .post('/user/login')
      .send({
        username,
        password
      })

    expect(res.statusCode).toBe(401)
    expect(res.body.message).toMatch(/Please insert username or password!/i)
  })

  test('❌ should fail if user not found', async () => {

    const username ='paijo'
    const password = 'Sunowl1811'
    await Users.findOne({ where: { username } });
    const res = await request(app)
      .post('/user/login')
      .send({
        username,
        password
      })

    expect(res.statusCode).toBe(404)
    expect(res.body.message).toMatch(/User not found, please register/i)
  })

  test('❌ should fail if password empty', async () => {

    const username ='cakrabsva'
    const password = ''
    await Users.findOne({ where: { username } });
    const res = await request(app)
      .post('/user/login')
      .send({
        username,
        password
      })

    expect(res.statusCode).toBe(401)
    expect(res.body.message).toMatch(/Please insert username or password!/i)
  })

  test('❌ should fail if incorrect Password', async () => {

    const username ='cakrabsva'
    const password = 'Sunowl'
    const user = await Users.findOne({ where: { username } });
    const res = await request(app)
      .post('/user/login')
      .send({
        username,
        password
      })
    const checkingPassword = Password.comparePassword(password, user.password)
    
    expect(checkingPassword).toBe(false)
    expect(res.statusCode).toBe(401)
    expect(res.body.message).toMatch(/Incorrect Password!/i)
  })

})

describe('GET /:username', () => {
  test('✅ should return user data', async () => {
    const username = 'cakrabsva'
    const res = await request(app)
      .get(`/user/${username}`)
    
    const user = await Users.findOne({ where: { username }, include: [{ model: Profiles }] })

    expect(res.statusCode).toBe(201)
    expect(res.body.username).toBe(user.username)
    expect(res.body.email).toBe(user.email)
    expect(res.body.Profile).toBeDefined()
    expect(res.body.Profile.UserId).toBe(user.id)
  })

  test('❌ should fail if username not in database', async() => {
    const username = 'cakrabsvaaa'
    const res = await request(app)
      .get(`/user/${username}`)
    
    const user = await Users.findOne({ where: { username }, include: [{ model: Profiles }] })

    expect(res.statusCode).toBe(404)
    expect(res.body.message).toMatch(/User not found/i)
  })
})
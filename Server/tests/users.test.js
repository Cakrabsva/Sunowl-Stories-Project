const request = require('supertest')
const {app} = require('../app')
const { sequelize, Users, Profiles } = require('../models');
const { Password } = require('../helpers/Password');
const { Jwt } = require('../helpers/Jasonwebtoken');
const { MyDate } = require('../helpers/MyDate');

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

//REGISTER=====================================
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
    expect(user.is_active).toBeTruthy()
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

// VERIFIED USER
describe('POST /:username/virified', ()=> {
  test('✅ it should return user verified', async () => {
    const username = 'cakrabsva'
    const res = await request(app)
      .post(`/user/${username}/verified`)
      .send({username})

    expect(res.statusCode).toBe(201)
    expect(res.body.message).toMatch(/Verifying User Successfully/i)
  })
})

// UPDATE TOKEN
describe('POST /:username/update-token', ()=> {
  test('✅ it should return updated token', async ()=> {
    const username = 'cakrabsva'
    const res = await request(app)
      .post(`/user/${username}/update-token`)
      .send({username})

    expect(res.statusCode).toBe(201)
    expect(res.body.message).toMatch(/Token Updated/i)
  })
})

//LOGIN=====================================
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

    expect(res.statusCode).toBe(400)
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

    expect(res.statusCode).toBe(400)
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
    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/Incorrect Password!/i)
  })

})

//GETUSER=====================================
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

//CHANGE EMAIL=====================================
describe('POST /:username/change-email', () => {
  test('❌ should fail user not verified', async () => {
    const username = 'cakrabsva'
    const email = 'cakrabilisairo.va@gmail.com'
    await Users.update({is_verified:false}, {where:{username}})
    const res = await request(app)
      .post(`/user/${username}/change-email`)
      .send({email})

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/Verify your email first/i)

    await Users.update({is_verified:true}, {where:{username}})
  })

  test('❌ should fail if insufficient update token', async () => {
    const username = 'cakrabsva'
    const email = 'cakrabilisairo.va@gmail.com'
    await Users.update({update_token:0},{where:{username}})
    const res = await request(app)
      .post(`/user/${username}/change-email`)
      .send({email})
    
    const user = await Users.findOne({where:{username}})

    expect(user.update_token).toEqual(0)
    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/Insufficient Update Token!/i)

    await Users.update({update_token:5},{where:{username}})
  })
  
  test('✅ should return updated email user', async() => {
    const username = 'cakrabsva'
    const email = 'cakrabilisairo.va@gmail.com'
    const res = await request(app)
      .post(`/user/${username}/change-email`)
      .send({email})
    const user = await Users.findOne({where:{username}})
 
    expect(user.update_token).toBeLessThan(5)
    expect(res.statusCode).toBe(201)
    expect(res.body.message).toMatch(/Email Updated Successfully/i)
    expect(user.email).toBe(email)
  })

  test('❌ should fail if email is empty', async () => {
    const username = 'cakrabsva'
    const email = ''
    const res = await request(app)
      .post(`/user/${username}/change-email`)
      .send({email})

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/Insert your new email!/i)
  })

  test('❌ should fail if email already used', async () => {
    const username = 'cakrabsva'
    const email = 'cakrabilisairo.va@gmail.com'
    const res = await request(app)
      .post(`/user/${username}/change-email`)
      .send({email})

    expect(res.statusCode).toBe(409)
    expect(res.body.message).toMatch(/Email already used/i)
  })

  test('❌ should fail if invalid email format', async () => {
    const username = 'cakrabsva'
    const email = 'cakraexample123.com'
    const res = await request(app)
      .post(`/user/${username}/change-email`)
      .send({email})

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/Invalid email format!/i)
  })

})

// CHANGE PASSWORD=====================================
describe('POST /:username/change-password', () => {

  test('❌ should fail if typo on typing password', async () => {
    const username = 'cakrabsva'
    const oldPassword = 'Sunowl1811'
    const newPassword = 'Pastisukses1811'
    const newPassword2 = 'Sunowl1811'
    const res = await request(app)
      .post(`/user/${username}/change-password`)
      .send({newPassword,oldPassword,newPassword2})

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/Password should be identic/i)
  })

  test('❌ should fail if old passwors same with new password', async () => {
    const username = 'cakrabsva'
    const oldPassword = 'Sunowl1811'
    const newPassword = 'Sunowl1811'
    const newPassword2 = 'Sunowl1811'
    const res = await request(app)
      .post(`/user/${username}/change-password`)
      .send({newPassword,oldPassword, newPassword2})

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/You make no difference/i)
  })

  test('❌ should fail user not verified', async () => {
    const username = 'cakrabsva'
    const oldPassword = 'Sunowl1811'
    const newPassword = 'Pastisukses1811'
    const newPassword2 = 'Pastisukses1811'
    await Users.update({is_verified:false}, {where:{username}})
    const res = await request(app)
    .post(`/user/${username}/change-password`)
    .send({newPassword,oldPassword, newPassword2})

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/Verify your email first/i)

    await Users.update({is_verified:true}, {where:{username}})
  })

  test('❌ should fail if insufficient update token', async () => {
     const username = 'cakrabsva'
    const oldPassword = 'Sunowl1811'
    const newPassword = 'Pastisukses1811'
    const newPassword2 = 'Pastisukses1811'
    await Users.update({update_token:0},{where:{username}})
    const res = await request(app)
      .post(`/user/${username}/change-password`)
      .send({oldPassword, newPassword, newPassword2})
    const user = await Users.findOne({where: {username}})

    expect(user.update_token).toBe(0)
    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/Insufficient Update Token!/i)

    await Users.update({update_token:4},{where:{username}})
  })
  
  test('✅ should return updated password user', async () => {
    const username = 'cakrabsva'
    const oldPassword = 'Sunowl1811'
    const newPassword = 'Pastisukses1811'
    const newPassword2 = 'Pastisukses1811'
    const res = await request(app)
      .post(`/user/${username}/change-password`)
      .send({oldPassword, newPassword, newPassword2})

    const newUser = await Users.findOne({
      where: {username}
    })
    
    expect(newUser.update_token).toBeLessThan(4)
    expect(res.statusCode).toBe(201)
    expect(res.body.message).toMatch(/Password Updated Successfully!/i)
    expect(Password.comparePassword(newPassword, newUser.password)).toBeTruthy()
  })

  test('❌ should fail if user not found', async () => {
    const username = 'cakrabsvaaaa'
    const oldPassword = 'Sunowl1811'
    const newPassword = 'Pastisukses1811'
    const newPassword2 = 'Pastisukses1811'
    const res = await request(app)
      .post(`/user/${username}/change-password`)
      .send({newPassword, oldPassword, newPassword2})
      
    expect(res.statusCode).toBe(404)
    expect(res.body.message).toMatch(/User Not Found/i)
  })

  test('❌ should fail if old password is empty', async () => {
    const username = 'cakrabsva'
    const oldPassword = ''
    const newPassword = 'Pastisukses1811'
    const newPassword2 = 'Pastisukses1811'
    const res = await request(app)
      .post(`/user/${username}/change-password`)
      .send({newPassword, oldPassword, newPassword2})

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/Please insert your password/i)
  })

  test('❌ should fail if incorrect old password', async () => {
    const username = 'cakrabsva'
    const oldPassword = 'Sunowl181111'
    const newPassword = 'Pastisukses1811'
    const newPassword2 = 'Pastisukses1811'
    const res = await request(app)
      .post(`/user/${username}/change-password`)
      .send({newPassword, oldPassword, newPassword2})

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/Incorrect Password/i)
  })

  test('❌ should fail if new Password is empty', async () => {
    const username = 'cakrabsva'
    const oldPassword = 'Sunowl1811'
    const newPassword = ''
    const newPassword2 = 'Pastisukses1811'
    const res = await request(app)
      .post(`/user/${username}/change-password`)
      .send({newPassword, oldPassword, newPassword2})

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/Please insert your password/i)
  })

  test('❌ should fail if new Password 2 is empty', async () => {
    const username = 'cakrabsva'
    const oldPassword = 'Sunowl1811'
    const newPassword = 'Pastisukses1811'
    const newPassword2 = ''
    const res = await request(app)
      .post(`/user/${username}/change-password`)
      .send({newPassword, oldPassword, newPassword2})

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/Please insert your password/i)
  })

})

//CHANGE USERNAME
describe('POST /:username/change-username', () => {

  test('❌ should fail if new username is empty', async()=> {
    const username = 'cakrabsva'
    const newUsername = ''
    const password ='Pastisukses1811'
    const res = await request(app)
      .post(`/user/${username}/change-username`)
      .send({newUsername, password})

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/New username cannot empty/i)
  })

  test('❌ should fail if user notfound', async()=> {
    const username = 'cakrabsvava'
    const newUsername = 'cakrabs'
    const password ='Pastisukses1811'
    const res = await request(app)
      .post(`/user/${username}/change-username`)
      .send({newUsername, password})

    expect(res.statusCode).toBe(404)
    expect(res.body.message).toMatch(/User Not Found/i)
  })

  test('❌ should fail if Incorrect Password', async()=> {
    const username = 'cakrabsva'
    const newUsername = 'cakrabs'
    const password ='Pastisukses181112'
    const res = await request(app)
      .post(`/user/${username}/change-username`)
      .send({newUsername, password})

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/Incorrect Password!/i)
  })

  test('❌ should fail user not verified', async () => {
    const username ='cakrabsva'
    const newUsername = 'cakrabs'
    const password ='Pastisukses1811'
    await Users.update({is_verified:false}, {where:{username}})
    const res = await request(app)
      .post(`/user/${username}/change-username`)
      .send({newUsername, password})

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/Verify your email first/i)

    await Users.update({is_verified:true}, {where:{username}})
  })

  test('❌ should fail if iInsufficient Update Token!', async()=> {
    const username ='cakrabsva'
    const newUsername = 'cakrabs'
    const password ='Pastisukses1811'
    await Users.update({update_token:0},{where:{username}})
    const res = await request(app)
      .post(`/user/${username}/change-username`)
      .send({newUsername, password})
    const user = await Users.findOne({where:{username}})

    expect(user.update_token).toEqual(0)
    expect(res.statusCode).toBe(400)
    expect(res.body.message).toMatch(/Insufficient Update Token!/i)
    await Users.update({update_token:3},{where:{username}})
  })

  test('✅ it should return updated username', async () => {
    const username ='cakrabsva'
    const newUsername = 'cakrabs'
    const password ='Pastisukses1811'
    const res = await request(app)
      .post(`/user/${username}/change-username`)
      .send({newUsername, password})
    const user = await Users.findOne({where:{username:newUsername}})

    expect(user.update_token).toBeLessThan(3)
    expect(res.statusCode).toBe(201)
    expect(res.body.message).toMatch(/Username Successfully Updated/i)
  })

  test('❌ should fail if username updatedAt less than 30 days', async()=> {
    const username = 'cakrabs'
    const user = await Users.findOne({where:{username}})
    const today = MyDate.formateDate(new Date())
    const usernameUpdatedAt = MyDate.formateDate(user.username_updatedAt)
    const usernameUpdatedAtValidity = MyDate.transformDate(today) - MyDate.transformDate(usernameUpdatedAt)

    expect(usernameUpdatedAtValidity).toBeLessThan(30)//defined here
  })
})
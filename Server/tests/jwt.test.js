const { Jwt } = require('../helpers/Jasonwebtoken')

describe('Generate Token Function', () => {
    const uuid = '52212c19-d487-402d-a7db-b0d3e91d0de2'
    let token;

    test('token should contain string', () => {
        token = Jwt.getToken({uuid})

        expect(typeof token).toBe('string');
        expect(token).not.toBe(uuid); 
        expect(token.length).toBeGreaterThan(20);
    })

    test('Token should contain UUID data when parsed', () => {
        const uuid = '52212c19-d487-402d-a7db-b0d3e91d0de2'
        let token = Jwt.getToken({uuid})
        let uuidChecked = Jwt.verifyToken(token)

        expect(typeof uuidChecked).toBe('object')
        expect(typeof uuidChecked.uuid).toBe('string')
        expect(uuidChecked.uuid).toMatch(uuid)
    })

}) 
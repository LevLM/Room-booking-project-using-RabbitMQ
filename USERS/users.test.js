const request = require('supertest')
const app = require('./users')
const User = require('./usermodels');

describe("POST (users):", () => {
    const user = new User(2, 'John', 'Doe', 'P1234567', '01/01/2000');
    test("server respond 200 status code /api/users", async () => {
        const response = await request(app).post("/api/users").send(user)
        expect(response.statusCode).toBe(201)
    })
})

describe("POST (rooms):", () => {
    const user2 = new User(2, 'John', '01/01/2000');
    test("when the part of data is missed", async () => {
        const response = await request(app).post("/api/users").send(user2)
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({error: "Invalid data"})
    })
})

const request = require('supertest')
const app2 = require('./users')
const User = require('./usermodels');
const app = require('../rooms/rooms')

describe("POST (users):", () => {
    const user = new User(2, 'John', 'Doe', 'P1234567', '01/01/2000');
    test("server respond 200 status code /api/users", async () => {
        const response = await request(app2).post("/api/users").send(user)
        expect(response.statusCode).toBe(201)
    })
})

describe("POST (users):", () => {
    const user2 = new User(2, 'John', '01/01/2000');
    test("when the part of data is missed", async () => {
        const response = await request(app2).post("/api/users").send(user2)
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({error: "Invalid data"})
    })
})

describe("GET (enter room):", () => {
    test("check if user entered in some room", async () => {
        const response = await request(app).get('/api/users/2/state')
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({state: user.state})
    })
})

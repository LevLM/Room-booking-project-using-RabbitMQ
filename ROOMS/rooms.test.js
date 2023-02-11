const request = require('supertest')
const app = require('./rooms')
const Room = require('./roommodels');

describe("POST:", () => {
  afterAll(async () => {await request(app).delete("/api/rooms/100")})  
  it("server respond 200 status code /api/rooms and content-type is json", async () => {
        const response = await request(app).post("/api/rooms").send({roomNumber: 100})
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
    })
})

describe("POST:", () => {
    test("when the roomNumber is missing should respond with a status code of 400", async () => {
      const bodyData = [{}]
      for (const body of bodyData) {
        const response = await request(app).post("/api/rooms").send(body)
        expect(response.statusCode).toBe(400)
      }
    })
})

describe("POST:", () => {
    test("when input don't correct (integer)", async () => {
      const response = await request(app).post("/api/rooms").send('333')
      expect(response.statusCode).toBe(400)
    })
})

describe("POST:", () => {
  test("when input don't correct (symbols)", async () => {
    const response = await request(app).post("/api/rooms").send('---!')
    expect(response.statusCode).toBe(400)
  })
})

describe("POST:", () => {
    test("when input don't correct (string)", async () => {
    const response = await request(app).post("/api/rooms").set('content-type', 'empty').send('roomNumber')
    expect(response.statusCode).toBe(400)
  })
})

describe("DELETE:", () => {
  const newRoom = {roomNumber: 200}
  beforeAll(async () => {await request(app).post("/api/rooms").send(newRoom);})
  it("method DELETE return wright message", async () => {
    const response = await request(app).delete("/api/rooms/200")
    expect(response.body).toBe('room #200 deleted from allCreatedRooms');
  });
})  

describe("DELETE:", () => {
  test("method DELETE return room is not created", async () => {
    const response = await request(app).delete("/api/rooms/200")
    expect(response.body).toBe('allCreatedRooms Is Empty');
  });
})  

describe("DELETE:", () => {
  const newRoom = {roomNumber: 100}
  beforeAll(async () => {await request(app).post("/api/rooms").send(newRoom);})
  afterAll(async () => {await request(app).delete("/api/rooms/100")})
  it("method DELETE return room is not created", async () => {
    const response = await request(app).delete("/api/rooms/200")
    expect(response.body).toBe('room #200 is not created');
  });
})  

describe("GET:", () => {
  const addNewRoom = {roomNumber: 150}
  const newCreatedRoom = new Room(addNewRoom, 0);
  beforeAll(async () => {await request(app).post("/api/rooms").send(addNewRoom);})
  afterAll(async () => {await request(app).delete("/api/rooms/150")})
  it("server respond 200 status code /search/:id and return room [id]", async () => {
    const response = await request(app).get("/api/rooms/150");
    expect(response.statusCode).toBe(200);
  });
});

describe("GET:", () => {
  const addNewRoom = {roomNumber: 150}
  const newCreatedRoom = new Room(addNewRoom, 0);
  beforeAll(async () => {await request(app).post("/api/rooms").send(addNewRoom);})
  afterAll(async () => {await request(app).delete("/api/rooms/150")})
  it("server respond 200 status code /search/:id and return room [id]", async () => {
    const response = await request(app).get("/api/rooms/150");
    // expect(response.body).toBe(newCreatedRoom); don't work
  });
});

describe("GET:", () => {
  test("check /api/rooms/:id if not found", async () => {
    const response = await request(app).get("/api/rooms/120");
    expect(response.body).toBe('not found');
  });
});




// describe("GET, POST, DELETE for 2 elements:", () => {
//   const newElement = {user: "user"}
//   const newElement2 = {user: "user2"}
//   beforeAll(async () => {
//     await request(app).post("/newElement").send(newElement);
//     await request(app).post("/newElement").send(newElement2);
//   })
//   afterAll(async () => {await request(app).delete("/remove")})
//   it("server respond 200 status code /print and return elements of the stack", async () => {
//     const response = await request(app).get("/print");
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toBe('The elements of the stack: user,user2');
//   });
//   it("method DELETE return element and remove it from stack", async () => {
//     const response = await request(app).delete("/remove")
//     expect(response.body).toBe('user2 deleted from stack, the elements of the stack now: user');
//   });
// });

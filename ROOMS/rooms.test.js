const request = require('supertest')
const app = require('./rooms')
const Room = require('./roommodels');

describe("POST (rooms):", () => {
  afterAll(async () => {await request(app).delete("/api/rooms/100")})  
  it("server respond 200 status code /api/rooms and content-type is json", async () => {
        const response = await request(app).post("/api/rooms").send({roomNumber: 100})
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
    })
})

describe("POST (rooms):", () => {
    test("when the roomNumber is missing should respond with a status code of 400", async () => {
      const bodyData = [{}]
      for (const body of bodyData) {
        const response = await request(app).post("/api/rooms").send(body)
        expect(response.statusCode).toBe(400)
      }
    })
})

describe("POST (rooms):", () => {
    test("when input don't correct (integer)", async () => {
      const response = await request(app).post("/api/rooms").send('333')
      expect(response.statusCode).toBe(400)
    })
})

describe("POST (rooms):", () => {
  test("when input don't correct (symbols)", async () => {
    const response = await request(app).post("/api/rooms").send('---!')
    expect(response.statusCode).toBe(400)
  })
})

describe("POST (rooms):", () => {
    test("when input don't correct (string)", async () => {
    const response = await request(app).post("/api/rooms").set('content-type', 'empty').send('roomNumber')
    expect(response.statusCode).toBe(400)
  })
})

describe("DELETE (rooms):", () => {
  const newRoom = {roomNumber: 200}
  beforeAll(async () => {await request(app).post("/api/rooms").send(newRoom);})
  it("method DELETE return wright message", async () => {
    const response = await request(app).delete("/api/rooms/200")
    expect(response.body).toBe('room #200 deleted from allCreatedRooms');
  });
})  

describe("DELETE (rooms):", () => {
  test("method DELETE return room is not created", async () => {
    const response = await request(app).delete("/api/rooms/200")
    expect(response.body).toBe('allCreatedRooms Is Empty');
  });
})  

describe("DELETE (rooms):", () => {
  const newRoom = {roomNumber: 100}
  beforeAll(async () => {await request(app).post("/api/rooms").send(newRoom);})
  afterAll(async () => {await request(app).delete("/api/rooms/100")})
  it("method DELETE return room is not created", async () => {
    const response = await request(app).delete("/api/rooms/200")
    expect(response.body).toBe('room #200 is not created');
  });
})  

describe("GET (rooms):", () => {
  const addNewRoom = {roomNumber: 150}
  beforeAll(async () => {await request(app).post("/api/rooms").send(addNewRoom);})
  afterAll(async () => {await request(app).delete("/api/rooms/150")})
  it("server respond 200 status code /search/:id and return room [id]", async () => {
    const response = await request(app).get("/api/rooms/150");
    expect(response.statusCode).toBe(200);
  });
});

describe("GET (rooms):", () => {
  const addNewRoom = {roomNumber: 150}
  // const newCreatedRoom = new Room(addNewRoom, 0);
  const newCreatedRoom = {roomNumber: 150, roomStatus: 0};
  beforeAll(async () => {await request(app).post("/api/rooms").send(addNewRoom);})
  afterAll(async () => {await request(app).delete("/api/rooms/150")})
  it("server respond 200 status code /search/:id and return room [id]", async () => {
    const response = await request(app).get("/api/rooms/150");
    // expect(response.body).toBe(newCreatedRoom);
    expect(response.body).toEqual(newCreatedRoom);
  });
});

describe("GET (rooms):", () => {
  test("check /api/rooms/:id if not found", async () => {
    const response = await request(app).get("/api/rooms/120");
    expect(response.body).toBe('not found');
  });
});

describe("POST (enter room):", () => {
  const addNewRoom = {roomNumber: 120}
  beforeAll(async () => {await request(app).post("/api/rooms").send(addNewRoom);})
  it("server respond 200 status code /api/rooms/:id/enteruser", async () => {
    const response = await request(app).post("/api/rooms/120/enteruser");
    expect(response.statusCode).toBe(200);
  });
});

describe("POST (enter room):", () => {
  test("server respond /api/rooms/:id/enteruser 'room not found' if there is not such room", async () => {
    const response = await request(app).post("/api/rooms/150/enteruser");
    expect(response.body).toBe('room not found');
  });
});

describe("POST (enter room):", () => {
  test("server respond 500 status code /api/rooms/:id/enteruser if room is occupied", async () => {
    const response = await request(app).post("/api/rooms/120/enteruser");
    expect(response.statusCode).toBe(500);
    expect(response.body).toBe('room is occupied by user: 2');
  });
});

describe("POST (exit room):", () => {
  test("server respond /api/rooms/:id/exituser 'room not found' if there is not such room", async () => {
    const response = await request(app).post("/api/rooms/150/enteruser");
    expect(response.body).toBe('room not found');
  });
});

describe("POST (exit room):", () => {
  const addNewRoom = {roomNumber: 150}
  beforeAll(async () => {await request(app).post("/api/rooms").send(addNewRoom);})
  afterAll(async () => {await request(app).delete("/api/rooms/150")})
  it("server respond 500 status code /api/rooms/:id/exituser if room is not occupied", async () => {
    const response = await request(app).post("/api/rooms/150/exituser");
    expect(response.statusCode).toBe(500);
    expect(response.body).toBe('room is not occupied');
  });
});

describe("POST (exit room):", () => {
  afterAll(async () => {await request(app).delete("/api/rooms/120")})
  it("server respond 200 status code /api/rooms/:id/exituser", async () => {
    const response = await request(app).post("/api/rooms/120/exituser");
    expect(response.statusCode).toBe(200);
  });
});

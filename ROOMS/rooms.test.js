const request = require('supertest')
const app = require('./rooms')

// describe("POST:", () => {
//     test("server respond 200 status code /newElement and content-type is json", async () => {
//         const response = await request(app).post("/newElement").send({user: "user"})
//         expect(response.statusCode).toBe(200)
//         expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
//     })
// })

// describe("POST:", () => {
//     test("when the user is missing should respond with a status code of 400", async () => {
//       const bodyData = [{}]
//       for (const body of bodyData) {
//         const response = await request(app).post("/newElement").send(body)
//         expect(response.statusCode).toBe(400)
//       }
//     })
// })

// describe("POST:", () => {
//     test("when input don't correct (integer)", async () => {
//       const response = await request(app).post("/newElement").send('333')
//       expect(response.statusCode).toBe(400)
//     })
// })

// describe("POST:", () => {
//   test("when input don't correct (symbols)", async () => {
//     const response = await request(app).post("/newElement").send('---!')
//     expect(response.statusCode).toBe(400)
//   })
// })

// describe("POST:", () => {
//     test("when input don't correct (string)", async () => {
//     const response = await request(app).post("/newElement").set('content-type', 'empty').send('user')
//     expect(response.statusCode).toBe(400)
//   })
// })

// describe("POST:", () => {
//   afterAll(async () => {await request(app).delete("/remove")})
//   it("when input don't correct (without value)", async () => {
//     const response = await request(app).post("/newElement").send({user: ""})
//     expect(response.statusCode).toBe(200)
//     })
// })

// describe("POST:", () => {
//   afterAll(async () => {await request(app).delete("/remove")})
//   it("when input correct but with added data ", async () => {
//     const bodyData = [{user: "user", password: "password"}]
//     for (const body of bodyData) {
//       const response = await request(app).post("/newElement").send(body)
//       expect(response.statusCode).toBe(200)
//     }
//   })
// })

// describe("DELETE:", () => {
//     test("server respond 200 status code /remove", async () => {
//       const response = await request(app).delete("/remove")
//       expect(response.statusCode).toBe(200)
//   })
// })

// describe("DELETE:", () => {
//   const newElement = {user: "user"}
//   beforeAll(async () => {await request(app).post("/newElement").send(newElement);})
//   it("method DELETE return element and remove it from stack", async () => {
//     const response = await request(app).delete("/remove")
//     expect(response.body).toBe('user deleted from stack, the elements of the stack now: ');
//   });
// })  

// describe("DELETE:", () => {
//   test("method DELETE return Stack Is Empty", async () => {
//     const response = await request(app).delete("/remove")
//     expect(response.body).toBe('Stack Is Empty');
//   });
// })  

// describe("GET:", () => {
//   const newElement = {user: "user"}
//   beforeAll(async () => {await request(app).post("/newElement").send(newElement);})
//   afterAll(async () => {await request(app).delete("/remove")})
//   it("server respond 200 status code /print and return elements of the stack", async () => {
//     const response = await request(app).get("/print");
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toBe('The elements of the stack: user');
//   });
//   it("server respond 200 status code /top and return top", async () => {
//     const response = await request(app).get("/top");
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toBe('user is top element of stack')
//   });
//   it("server respond 200 status code /length and return correct length", async () => {
//     const response = await request(app).get("/length");
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toBe(1);
//   });
// });

// describe("GET:", () => {
//   const newElement = {user: "user"}
//   beforeAll(async () => {await request(app).post("/newElement").send(newElement);})
//   afterAll(async () => {await request(app).delete("/remove")})
//   it("server respond 200 status code /search/:id and return element [id]", async () => {
//     const response = await request(app).get("/search/0");
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toBe('user');
//   });
// });

// describe("GET:", () => {
//   test("check /search/:id if stack is empty", async () => {
//     const response = await request(app).get("/search/0");
//     expect(response.body).toBe('Stack Is Empty');
//   });
// });

// describe("GET:", () => {
//   const newElement = {user: "user"}
//   beforeAll(async () => {await request(app).post("/newElement").send(newElement);})
//   afterAll(async () => {await request(app).delete("/remove")})
//   it("check /search/:id if there isn't such id", async () => {
//     const response = await request(app).get("/search/255");
//     expect(response.body).toBe('not found');
//   });
// });

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

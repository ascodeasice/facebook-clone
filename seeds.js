// Populate database with fake data made with Faker module
const { faker } = require("@faker-js/faker");
const { DateTime } = require("luxon");
const User = require("./models/User");

require("dotenv").config();

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGO_URL;
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}


// SECTION generate fake users
// const USERS = [];

// function getFakeBio() {
//     return `Hello, my name is ${faker.name.firstName()}, I'm from ${faker.address.country()}
// I was born in ${DateTime.fromJSDate(faker.date.birthdate()).toFormat("yyyy/MM/dd")}.
// I like to ${faker.word.verb()} my ${faker.word.adjective()} ${faker.word.noun()} in my free time.
// My favorite thing is ${faker.commerce.product()}`;
// }

// function createRandomUser(fakeUserId) {
//     return {
//         facebookId: fakeUserId,
//         username: faker.internet.userName(),
//         profilePictureURL: faker.image.avatar(),
//         friends: [],
//         bio: getFakeBio(),
//     };
// }

// function getRandomInt(max) {
//     return Math.floor(Math.random() * max);
// }

// for (let i = 0; i < 10; i++) {
//     USERS.push(createRandomUser("fakeUserId" + i));
// }

// const fakeData = USERS.map((user) => new User(user));

// // make them friends randomly
// for (let i = 0; i < 10; i++) {
//     for (let j = 0; j < 3; j++) {
//         let randomNum = getRandomInt(10);
//         if (fakeData[i].friends.includes(fakeData[randomNum]._id) || randomNum == i) {
//             continue;
//         }
//         fakeData[i].friends.push(fakeData[randomNum]._id);
//         fakeData[randomNum].friends.push(fakeData[i]._id);
//     }
// }

// fakeData.forEach((data) => {
//     data.save()
//         .catch(err => {
//             console.log(err);
//         });
// })

// SECTION generate fake posts

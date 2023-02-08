// Populate database with fake data made with Faker module
const { faker } = require("@faker-js/faker");
const { DateTime } = require("luxon");
const User = require("./models/User");
const Post = require("./models/Post");

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

const numbers = [];
for (let i = 0; i < 10; i++) {
    numbers.push(i);
}

const fakeFacebookId = numbers.map(num => "fakeUserId" + num.toString());

for (let i = 0; i < fakeFacebookId.length; i++) {
    User.find({ facebookId: fakeFacebookId[i] })
        .exec((err, users) => {
            if (err) {
                console.log(err);
                return;
            }
            for (let i = 0; i < users.length; i++) {
                // SECTION delete all fake post
                // Post.find({ author: users[i]._id })
                //     .exec((err, posts) => {
                //         posts.forEach(post => Post.findByIdAndRemove(post._id, (err, post) => console.log(post + " is deleted")))
                //     })
                fetch(faker.image.nature())
                    .then(res => res.arrayBuffer())
                    .then((res) => {
                        const post = new Post({
                            author: users[i]._id,
                            text: faker.hacker.phrase(),
                            images: [Buffer.from(res, "utf-8")],
                        })
                        post.save()
                            .catch(err => {
                                console.log(err);
                            })
                            .then(post => console.log("saved"));
                    })
            }
        })
}


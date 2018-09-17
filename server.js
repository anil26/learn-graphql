var express = require('express')
var express_graphql = require('express-graphql')

var { buildSchema } = require('graphql')

// Graphql schema
var coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

var schema = buildSchema(`
    type Query {
      course(id: Int!): Course
      courses(topic: String): [Course]
    }
    type Mutation {
        updateCourseTopic(id: Int!, topic: String): Course
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`)

var getCourse = function(args) {
    var id = args.id
    return coursesData.filter(course => course.id === id)[0]
}

var getCourses = function(args) {
    if(args.topic) {
        return coursesData.filter(course => course.topic === args.topic)
    } else {
        return coursesData
    }
}

var updateCourseTopic = function(args) {
    //console.log("id is", id)
    const topic = args.topic
    const id = args.id
    console.log("id and topic are", topic, id)
    coursesData.forEach((course) => {
        if(course.id === id) {
            course.topic = topic
        }
    })

    return coursesData.filter(course => course.id === id)[0]
}
//Root resolver
var root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic

}
// query getSingleCourse($courseId: Int!){
//     course(id: $courseId) {
//       title
//       description
//       topic
//       url
//     }
//   }
//{"courseId": 1}

// query getAllCourse($topic: String) {
//     courses(topic: $topic) {
//       title
//       description
//       topic
//       url
//     }
//   }
// {"topic": "Node.js"}
// query getCoursesWithFragments($courseID1: Int!, $courseID2: Int!) {
//     course1: course(id: $courseID1) {
//       ...courseFields
//     }
//     course2: course(id: $courseID2) {
//       ...courseFields
//     }
//   }
  
//   fragment courseFields on Course {
//     title
//     description
//     topic
//     url
//   }
  
// {
//     "courseID1": 1,
//       "courseID2": 2
//   }
  
// mutation updateCourseTopic($id: Int!, $topic: String!) {
//     updateCourseTopic(id: $id, topic: $topic) {
//       ...courseFields
//     }
//   }
  
//   fragment courseFields on Course {
//     title
//     description
//     topic
//     url
//   }
// {
//     "id": 1,
//     "topic": "my new topic string"
//   }
  


//Create an express server

var app = express()

app.use("/graphql", express_graphql({
    schema,
    rootValue: root,
    graphiql: true,
}))

app.listen(3443, () => {
    console.log("server starterd at http://localhost:3443")
})
const Sequelize = require('sequelize');
require('dotenv').config()

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env

var sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
    host: PGHOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

var Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
})

Course.hasMany(Student, { foreignKey: 'course' });

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve('Sync successful!')
        }).catch(() => {
            reject('unable to sync the database');
        })
    });

}

module.exports.getAllStudents = function () {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            order: [
                [
                    'studentNum', 'ASC'
                ]
            ]
        }).then((data) => {
            resolve(data)
        }).catch((error) => {
            reject('no results returned');
        })
    });
}

module.exports.getCourses = function () {
    return new Promise(function (resolve, reject) {
        Course.findAll({
            order: [
                [
                    'courseId', 'ASC'
                ]
            ]
        }).then((data) => {
            resolve(data)
        }).catch((error) => {
            reject('no results returned')
        })
    });

};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: {
                studentNum: num
            }
        }).then((data) => {

            resolve(data[0])

        }).catch((error) => {
            reject('no results returned')
        })
    });

};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        Student.findAll({

            order: [
                [
                    'studentNum', 'ASC'
                ]
            ],
            where: {
                course: course
            }
        }).then((data) => {
            resolve(data)
        }).catch((error) => {
            reject('no results returned')
        })
    });

};

module.exports.getCourseById = function (id) {
    return new Promise(function (resolve, reject) {

        Course.findAll({
            where: {
                courseId: id
            }
        }).then((data) => {

            resolve(data[0])
        }).catch((error) => {
            reject('no results returned')
        })
    });

};

module.exports.addStudent = function (studentData) {
    studentData.TA = (studentData.TA) ? true : false;
    for (const i in studentData) {
        if (studentData[i] == '') {
            studentData[i] = null
        }
    }
    return new Promise(function (resolve, reject) {
        Student.create(studentData).then((data) => {
            resolve(data)
        }).catch((error) => {
            reject("unable to create student")
        })
    });


};

module.exports.addCourse = function (courseData) {
    for (const i in courseData) {
        if (courseData[i] == '') {
            courseData[i] = null
        }
    }
    return new Promise(function (resolve, reject) {
        Course.create(courseData).then((data) => {
            resolve(data)
        }).catch((error) => {
            reject("unable to create course")
        })
    });

};

module.exports.updateStudent = function (studentData) {
    studentData.TA = (studentData.TA) ? true : false;
    for (const i in studentData) {
        if (studentData[i] == '') {
            studentData[i] = null
        }
    }
    return new Promise(function (resolve, reject) {
        Student.update(studentData, {
            where: { studentNum: studentData.studentNum }
        }).then((data) => {
            resolve(data)
        }).catch((error) => {
            reject("unable to update student")
        })
    });
};

module.exports.updateCourse = function (courseData) {
    for (const i in courseData) {
        if (courseData[i] == '') {
            courseData[i] = null
        }
    }
    return new Promise(function (resolve, reject) {
        Course.update(courseData, {
            where: { courseId: courseData.courseId }
        }).then((data) => {
            resolve(data)
        }).catch((error) => {
            reject("unable to update course")
        })
    });
};


module.exports.deleteCourseById = function (id) {
    return new Promise(function (resolve, reject) {

        Course.destroy({
            where: {
                courseId: id
            }
        }).then(() => {
            resolve('destroyed')
        }).catch((error) => {
            reject('was rejected')
        })
    });

};

module.exports.deleteStudentByNum = function (studentNum) {
    return new Promise(function (resolve, reject) {
        Student.destroy({
            where: {
                studentNum: studentNum
            }
        }).then(() => {
            resolve('destroyed')
        }).catch((error) => {
            reject('was rejected')
        })
    })
}


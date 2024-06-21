const { Sequelize } = require('sequelize');

const studentModel = require('./schemas/student/student')
const educatorModel = require('./schemas/educator/educator')
const studentKycModel = require('./schemas/student/studentKyc')
const courseModel = require('./schemas/course/course')
const subjectModel = require('./schemas/subject/subject')
const chapterModel = require('./schemas/chapter/chapter')
const questionModel = require('./schemas/question/question')
const optionModel = require('./schemas/option/option')
const examModel = require('./schemas/exam/exam')
const studentAssessmentRecordModel = require('./schemas/student/assessmentRecord')
const academicPaperModel = require('./schemas/academicPaper/academicPaper')
const educatorTestSeriesModel = require('./schemas/educator/testSeries')
const examSubjectAssociationModel = require('./schemas/association/examSubjectAssociation')
const subjectChapterAssociationModel = require('./schemas/association/subjectChapterAssociation')
const chapterQuestionAssociationModel = require('./schemas/association/chapterQuestionAssociation')
const questionOptionAssociationModel = require('./schemas/association/questionOptionAssociation')
const courseExamAssociationModel = require('./schemas/association/courseExamAssociation')
const examAcademicPaperAssociationModel = require('./schemas/association/examAcademicPaperAssociation')
const questionAcademicPaperAssociationModel = require('./schemas/association/questionAcademicPaperAssociation')
const subjectAcademicPaperAssociationModel = require('./schemas/association/subjectAcademicPaperAssociation')
const educatorTestSeriesQuestionAssociationModel = require('./schemas/association/educatorTestSeriesQuestionAssociation')




exports.dbConfig = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        operatorsAliases: 0,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        timezone: '+05:30',
        logging: false,
    }
);


exports.studentModel = studentModel(exports.dbConfig, Sequelize)
exports.educatorModel = educatorModel(exports.dbConfig, Sequelize)
exports.studentKycModel = studentKycModel(exports.dbConfig, Sequelize)
exports.courseModel = courseModel(exports.dbConfig, Sequelize)
exports.subjectModel = subjectModel(exports.dbConfig, Sequelize)
exports.chapterModel = chapterModel(exports.dbConfig, Sequelize)
exports.questionModel = questionModel(exports.dbConfig, Sequelize)
exports.optionModel = optionModel(exports.dbConfig, Sequelize)
exports.examModel = examModel(exports.dbConfig, Sequelize)
exports.academicPaperModel = academicPaperModel(exports.dbConfig, Sequelize)
exports.educatorTestSeriesModel = educatorTestSeriesModel(exports.dbConfig, Sequelize)
exports.studentAssessmentRecordModel = studentAssessmentRecordModel(exports.dbConfig, Sequelize)
exports.examSubjectAssociationModel = examSubjectAssociationModel(exports.dbConfig, Sequelize)
exports.subjectChapterAssociationModel = subjectChapterAssociationModel(exports.dbConfig, Sequelize)
exports.chapterQuestionAssociationModel = chapterQuestionAssociationModel(exports.dbConfig, Sequelize)
exports.questionOptionAssociationModel = questionOptionAssociationModel(exports.dbConfig, Sequelize)
exports.courseExamAssociationModel = courseExamAssociationModel(exports.dbConfig, Sequelize)
exports.examAcademicPaperAssociationModel = examAcademicPaperAssociationModel(exports.dbConfig, Sequelize)
exports.questionAcademicPaperAssociationModel = questionAcademicPaperAssociationModel(exports.dbConfig, Sequelize)
exports.subjectAcademicPaperAssociationModel = subjectAcademicPaperAssociationModel(exports.dbConfig, Sequelize)
exports.educatorTestSeriesQuestionAssociationModel = educatorTestSeriesQuestionAssociationModel(exports.dbConfig, Sequelize)
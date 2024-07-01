module.exports = {

    ROLES: {
        STUDENT: 'student',
        EDUCATOR: 'educator',
        ADMIN: 'admin'
    },

    LANGUAGE: {
        ENGLISH: 'english',
        HINDI: 'hindi'
    },

    GENDERS: {
        MALE: 'male',
        FEMALE: 'female',
        OTHER: 'other'
    },

    OPTION_TYPE: {
        MULTIPLE_CHOICE: 'mcqs',
        TRUE_OR_FALSE: 'tfq',
        SHORT_ANSWER: 'saq'
    },

    CONTANT_TYPE: {
        IMAGE: 'image',
        TEXT: 'text',
        BOTH: 'both'
    },

    PAPER_TYPE: {
        PREVIOUS: 'previous',
        DUMMY: 'dummy',
        PRACTICE: 'practice',
        SAMPLE: 'sample'
    },

    STATUS: {
        SUCCESS: 'success',
        FAILED: 'failed',
        TRUE: 'true',
        FALSE: 'false'
    },

    ANSWERSTATUS: {
        CORRECT: 'green',
        WRONG: 'red',
        SKIPPED: 'grey'
    },

    QUALIFICATION: {
        TENTH: '10th',
        TWELFTH: '12th',
        GRADUATION: 'graduation',
        POST_GRADUATION: 'post_graduation',
        PHD: 'phd'
    },

    ENROLLMENT_TYPE: {
        FREE: 'free',
        PURCHASED: 'purchased',
        TRIAL: 'trial'
    },

    DEFAULT: {
        USER_IMAGE: 'https://rgyan-flutter200503-dev.s3.ap-south-1.amazonaws.com/web/pg/mobileMenuIcons/profile.png'
    },

    ERROR_MESSAGES: {
        DUBLICATE_EMAIL: 'Email address already in use!',
        DUBLICATE_PHONE_NUMBER: 'Mobile number already in use!',
        REQUIRED_DATA: 'Data is required',
        INCORRECT_ANSWER: 'Answer is incorrect',
        INCORRECT_PASSWORD: 'Incorrect password',
        NOT_USER: 'User not found',
        INVALID_EMAIL: 'Invalid email',
        SHORT_PASSWORD: 'Password is too short',
        WRONG_URL: 'Make sure url is correct!!',
        DATABASE_NOT_CONNECTED: 'Could not connect to the database. Error:',
        INVALID_OPTION: 'Option is not related to this question',
        DUBLICATE_USER: 'User already exists',
        DUBLICATE_TRIAL: 'You already used trail',
        DUBLICATE_TEST: 'You already have this test'
    },

    SUCCESS_MESSAGES: {
        CORRECT_ANSWER: 'Answer is correct',
        SUCCESSFUL_LOGIN: 'Login successfully',
        NEW_PROFILE: 'Profile created successfully',
        PROFILE_UPDATED: 'Profile updated successfully',
        PASSWORD_UPDATE: 'Password updated successfully',
        DATABASE_CONNECTED: 'Database connected successfully',
        SAVE_DATA: 'Data save successfully'
    }
}
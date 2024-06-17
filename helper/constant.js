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
        MULTIPLE_CHOICE: 'multiple_choice',
        TRUE_OR_FALSE: 'true_false',
        SHORT_ANSWER: 'short_answer'

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
        FAILED: 'failed'
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
        DATABASE_NOT_CONNECTED: 'Could not connect to the database. Exiting now...'
    },

    SUCCESS_MESSAGES: {
        CORRECT_ANSWER: 'Answer is correct',
        SUCCESSFUL_LOGIN: 'Login successfully',
        NEW_PROFILE: 'Profile created successfully',
        PROFILE_UPDATED: 'Profile updated successfully',
        PASSWORD_UPDATE: 'Password updated successfully',
        DATABASE_CONNECTED: 'Connected to Database!!',
        SAVE_DATA: 'Data save successfully'
    }
}
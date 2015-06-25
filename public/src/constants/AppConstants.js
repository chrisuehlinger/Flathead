const keyMirror = require('react/lib/keyMirror');

module.exports = {

  ActionTypes: keyMirror({
    ADD_TASK: null,
    ADD_STUDENT:null,
    REPLACE_ALL_STUDENTS:null,
    REPLACE_ALL_COLUMNS:null,
    SET_ASCENDING_SORT:null,
    SET_DESCENDING_SORT:null,
    SET_MIN_SCORE:null,
    SET_MAX_SCORE:null,
    SET_MIN_OVERDUE:null
  }),

  ActionSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};

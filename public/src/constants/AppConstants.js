const keyMirror = require('key-mirror');

module.exports = {

  ActionTypes: keyMirror({
    REPLACE_ALL_SUITES: null,
    CREATE_NEW_SUITE: null,
    ADD_SUITE: null,
    UPDATE_SUITE: null,
    DELETE_SUITE: null,
    SELECT_SUITE: null,
    ADD_ROUTE: null,
    UPDATE_ROUTE: null,
    DELETE_ROUTE: null
  }),

  ActionSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};

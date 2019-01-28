const express = require('express');
const logger = require('../logger').logger;
const {
  createGroup,
  getAllGroups,
  addMember,
  deleteMember
} = require('../controller/groups');

const apiGroups = express.Router();
const apiGroupsProtected = express.Router();

apiGroups.get('/', (req, res) => {
  getAllGroups().then(groups =>
    res.status(200).send({
      success: true,
      profile: groups,
      message: 'groups retrieved with success'
    })
  );
});

apiGroupsProtected.post('/', (req, res) =>
  !req.body.title || !req.body.description
    ? res.status(400).send({
        success: false,
        message: 'title and description required'
      })
    : createGroup(req.body, req.user)
        .then(() =>
          res.status(201).send({
            success: true,
            message: 'group created'
          })
        )
        .catch(err => {
          logger.error(`💥 Failed to create group : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`
          });
        })
);

apiGroupsProtected.put('/add', (req, res) => {
  logger.debug(req.user);
  !req.body.title || !req.body.email
    ? res.status(400).send({
        success: false,
        message: 'group title and user email required'
      })
    : addMember(req.body.title, req.body.email, req.user)
        .then(() =>
          res.status(200).send({
            success: true,
            message: 'user added in the group'
          })
        )
        .catch(err => {
          logger.error(`💥 Failed to add member : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`
          });
        });
});

apiGroupsProtected.put('/del', (req, res) =>
  !req.body.title || !req.body.email
    ? res.status(400).send({
        success: false,
        message: 'group title and user email required'
      })
    : deleteMember(req.body.title, req.body.email, req.user.id)
        .then(() =>
          res.status(200).send({
            success: true,
            message: 'user removed from the group'
          })
        )
        .catch(err => {
          logger.error(`💥 Failed to remove member : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`
          });
        })
);

module.exports = { apiGroups, apiGroupsProtected };

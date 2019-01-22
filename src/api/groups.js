const express = require('express');
const logger = require('../logger').logger;
const { createGroup, getAllGroups } = require('../controller/groups');

const apiGroups = express.Router();
const apiGroupsProtected = express.Router();

apiGroups.get('/', (req, res) => {
  getAllGroups().then(groups =>
    res.status(200).send({
      success: true,
      profile: groups,
      message: 'groups retrieved with success',
    })
  );
});

apiGroupsProtected.post('/', (req, res) =>
  !req.body.title
    ? res.status(400).send({
        success: false,
        message: 'title is required',
      })
    : createGroup(req.body, req.user)
        .then(() =>
          res.status(201).send({
            success: true,
            message: 'group created',
          })
        )
        .catch(err => {
          logger.error(`💥 Failed to create group : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`,
          });
        })
);

module.exports = { apiGroups, apiGroupsProtected };

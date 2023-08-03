'use strict';

module.exports = ({ strapi }) => {
  const modelService = strapi.plugins['ai-content'].services.models;

  const getModels = async (ctx) => {
    try {
      return modelService.getModels();
    } catch (err) {
      ctx.throw(500, err);
    }
  };

  return {
    getModels,
  };
};

'use strict';

module.exports = ({ strapi }) => {
  const createCompletion = async (ctx) => {
    const reqBody = ctx.request.body;
    const { aiType, prompt, temperature, maxTokens } = reqBody;
    if (aiType && prompt && temperature && maxTokens) {
      try {
        return await strapi
          .service('api::ai-setting.ai-setting')
          .generateText(reqBody);
      } catch (err) {
        console.log(err);
        return err
        // ctx.throw(500, err);
      }
    }
    return ctx.throw(
      400,
      'Either the prompt, temperature, aiType or maxToken parameter is missing'
    );
  };

  const getTemplates = async (ctx) => {
    const app = await strapi.db
      .query('api::ai-template.ai-template')
      .findMany({});
    return app; // strapi.plugin('ai-content').config('templates');
  };

  return {
    createCompletion,
    getTemplates,
  };
};

import { request } from '@strapi/helper-plugin';

const completions = {
  create: async (reqBody) => {
    const data = await request(`/ai-content/completions`, {
      method: 'POST',
      body: reqBody,
    });
    return data;
  },
  templates: async ({ }) => {
    const data = await request(`/ai-content/templates`, {
      method: 'GET',
    });
    return data;
  },
};
export default completions;

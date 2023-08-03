import { request } from '@strapi/helper-plugin';

const models = {
  get: async () => {
    const data = await request(`/ai-content/models`, {
      method: 'GET',
    });
    return data;
  },
};
export default models;

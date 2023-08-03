import { request } from '@strapi/helper-plugin';

const settings = {
  get: async () => {
    const data = await request(`/ai-content/settings`, {
      method: 'GET',
    });
    return data;
  },
  set: async (data) => {
    return await request(`/ai-content/settings`, {
      method: 'POST',
      body: data,
    });
  }
};
export default settings;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseUrl = 'https://api.newscatcherapi.com/v2/';
const newsapiOrgBase = 'https://newsapi.org/v2/';
export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: newsapiOrgBase,
    headers: {
      'x-api-key': 'bcc68e054dcb41e59cc0e216b6be64ec',
    },
  }),
  endpoints: (builder) => ({
    getLatestHeadlines: builder.mutation({
      query: (data) => {
        return {
          url: 'top-headlines?language=en',
          params: data,
          method: 'GET',
        };
      },
    }),
  }),
});

export const { useGetLatestHeadlinesMutation } = newsApi;
